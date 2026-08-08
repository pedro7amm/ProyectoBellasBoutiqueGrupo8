import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { usuariosSemilla } from '../datos/usuariosAdmin.js'
import { generarClaveAleatoria } from '../datos/claves.js'
import { useBitacora } from './BitacoraContext.jsx'

const SesionContext = createContext(null)

const CLAVE_USUARIOS = 'bella-boutique-admin-usuarios'
const CLAVE_SESION = 'bella-boutique-admin-sesion'

// Cierra la sesión automáticamente si no hay actividad del mouse/teclado/touch
// durante este tiempo, sin importar el rol del usuario conectado.
const TIEMPO_INACTIVIDAD_MS = 5 * 60 * 1000
const EVENTOS_ACTIVIDAD = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

const leer = (clave, valorPorDefecto) => {
  try {
    const guardado = sessionStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

const guardar = (clave, valor) => {
  try {
    sessionStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* sessionStorage lleno o bloqueado: la sesión sigue funcionando en memoria */
  }
}

export function ProveedorSesion({ children }) {
  const [usuarios, setUsuarios] = useState(() => leer(CLAVE_USUARIOS, usuariosSemilla))
  const [sesion, setSesion] = useState(() => leer(CLAVE_SESION, null))
  const { registrarEvento } = useBitacora()

  useEffect(() => guardar(CLAVE_USUARIOS, usuarios), [usuarios])
  useEffect(() => guardar(CLAVE_SESION, sesion), [sesion])

  const iniciarSesion = (usuario, clave) => {
    const encontrado = usuarios.find(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.clave === clave,
    )
    if (!encontrado) return { ok: false, error: 'Usuario o contraseña incorrectos.' }
    if (encontrado.estado === 'Inactivo') {
      return { ok: false, error: 'Este usuario está inactivo. Contactá a un administrador.' }
    }
    setSesion({ id: encontrado.id })
    return { ok: true }
  }

  // Usado por el modal de acceso del cliente: busca por correo en vez de usuario,
  // para poder distinguir "no es cuenta de personal" (sigue el flujo normal de cliente)
  // de "sí es personal, pero la contraseña o el estado no son correctos".
  const iniciarSesionPorCorreo = (correo, clave) => {
    const cuenta = usuarios.find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase())
    if (!cuenta || cuenta.clave !== clave) return { ok: false, motivo: 'no-encontrado' }
    if (cuenta.estado === 'Inactivo') {
      return {
        ok: false,
        motivo: 'inactivo',
        error: 'Este usuario está inactivo. Contactá a un administrador.',
      }
    }
    setSesion({ id: cuenta.id })
    return { ok: true }
  }

  const cerrarSesion = () => setSesion(null)

  /**
   * Recuperar contraseña, simulado: como no hay backend no se puede enviar un correo
   * real, así que generamos una contraseña nueva y se la devolvemos a quien la pidió
   * para que la vea en pantalla.
   */
  const generarClaveTemporal = (correo) => {
    const cuenta = usuarios.find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase())
    if (!cuenta) return { ok: false }
    const claveNueva = generarClaveAleatoria()
    setUsuarios((actuales) =>
      actuales.map((u) => (u.id === cuenta.id ? { ...u, clave: claveNueva } : u)),
    )
    registrarEvento({
      actor: `${cuenta.nombre} (${cuenta.rol})`,
      accion: 'modificacion',
      modulo: 'Usuarios',
      descripcion: 'Solicitó recuperar su contraseña.',
    })
    return { ok: true, clave: claveNueva }
  }

  // Auto-logout por inactividad: se activa solo mientras hay una sesión abierta.
  const temporizador = useRef(null)
  useEffect(() => {
    if (!sesion) return undefined

    const reiniciarTemporizador = () => {
      if (temporizador.current) clearTimeout(temporizador.current)
      temporizador.current = setTimeout(cerrarSesion, TIEMPO_INACTIVIDAD_MS)
    }

    reiniciarTemporizador()
    EVENTOS_ACTIVIDAD.forEach((evento) => window.addEventListener(evento, reiniciarTemporizador))

    return () => {
      if (temporizador.current) clearTimeout(temporizador.current)
      EVENTOS_ACTIVIDAD.forEach((evento) =>
        window.removeEventListener(evento, reiniciarTemporizador),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!sesion])

  const usuarioActual = sesion ? usuarios.find((u) => u.id === sesion.id) || null : null

  const actorActual = usuarioActual ? `${usuarioActual.nombre} (${usuarioActual.rol})` : 'Desconocido'

  const agregarUsuario = (datos) => {
    setUsuarios((actuales) => [
      ...actuales,
      { ...datos, id: Math.max(0, ...actuales.map((u) => u.id)) + 1 },
    ])
    registrarEvento({
      actor: actorActual,
      accion: 'alta',
      modulo: 'Usuarios',
      descripcion: `Creó al usuario "${datos.nombre}" (${datos.rol}).`,
    })
  }

  const editarUsuario = (id, cambios) => {
    setUsuarios((actuales) => actuales.map((u) => (u.id === id ? { ...u, ...cambios } : u)))
    const nombre = usuarios.find((u) => u.id === id)?.nombre || `#${id}`
    registrarEvento({
      actor: actorActual,
      accion: 'modificacion',
      modulo: 'Usuarios',
      descripcion: `Editó al usuario "${nombre}".`,
    })
  }

  const eliminarUsuario = (id) => {
    const nombre = usuarios.find((u) => u.id === id)?.nombre || `#${id}`
    setUsuarios((actuales) => actuales.filter((u) => u.id !== id))
    if (sesion?.id === id) cerrarSesion()
    registrarEvento({
      actor: actorActual,
      accion: 'baja',
      modulo: 'Usuarios',
      descripcion: `Eliminó al usuario "${nombre}".`,
    })
  }

  const valor = {
    usuarios,
    sesion,
    usuarioActual,
    esAdmin: usuarioActual?.rol === 'Administrador',
    iniciarSesion,
    iniciarSesionPorCorreo,
    cerrarSesion,
    generarClaveTemporal,
    agregarUsuario,
    editarUsuario,
    eliminarUsuario,
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error('useSesion debe usarse dentro de <ProveedorSesion>')
  return contexto
}
