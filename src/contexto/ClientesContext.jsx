import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { generarClaveAleatoria } from '../datos/claves.js'
import { useBitacora } from './BitacoraContext.jsx'

const ClientesContext = createContext(null)

const CLAVE_CLIENTES = 'bella-boutique-clientes'
const CLAVE_SESION_CLIENTE = 'bella-boutique-sesion-cliente'

// Mismo criterio que el panel de personal: cierra sesión sola tras 5 min sin actividad.
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

// Las personas que se registran desde la página de inicio (no las crea un administrador)
// quedan guardadas acá como "clientes" — separado de datos/usuariosAdmin.js, que es
// exclusivamente para personal (administradores y vendedores).
export function ProveedorClientes({ children }) {
  const [clientes, setClientes] = useState(() => leer(CLAVE_CLIENTES, []))
  const [sesion, setSesion] = useState(() => leer(CLAVE_SESION_CLIENTE, null))
  const { registrarEvento } = useBitacora()

  useEffect(() => guardar(CLAVE_CLIENTES, clientes), [clientes])
  useEffect(() => guardar(CLAVE_SESION_CLIENTE, sesion), [sesion])

  const existeCorreo = (correo) =>
    clientes.some((c) => c.correo.toLowerCase() === correo.trim().toLowerCase())

  const registrarCliente = (datos) => {
    const correo = datos.correo.trim().toLowerCase()
    if (existeCorreo(correo)) {
      return { ok: false, error: 'Ya existe una cuenta de cliente con ese correo.' }
    }
    const nuevo = {
      ...datos,
      correo,
      id: Math.max(0, ...clientes.map((c) => c.id)) + 1,
    }
    setClientes((actuales) => [...actuales, nuevo])
    setSesion({ id: nuevo.id })
    registrarEvento({
      actor: `Cliente: ${nuevo.nombre}`,
      accion: 'alta',
      modulo: 'Clientes',
      descripcion: `Se registró desde la tienda con el correo ${nuevo.correo}.`,
    })
    return { ok: true }
  }

  const iniciarSesion = (correo, clave) => {
    const encontrado = clientes.find(
      (c) => c.correo.toLowerCase() === correo.trim().toLowerCase() && c.clave === clave,
    )
    if (!encontrado) return { ok: false }
    setSesion({ id: encontrado.id })
    return { ok: true }
  }

  const cerrarSesion = () => setSesion(null)

  /** Recuperar contraseña, simulado (ver misma nota en SesionContext.jsx). */
  const generarClaveTemporal = (correo) => {
    const cuenta = clientes.find((c) => c.correo.toLowerCase() === correo.trim().toLowerCase())
    if (!cuenta) return { ok: false }
    const claveNueva = generarClaveAleatoria()
    setClientes((actuales) =>
      actuales.map((c) => (c.id === cuenta.id ? { ...c, clave: claveNueva } : c)),
    )
    return { ok: true, clave: claveNueva }
  }

  // Auto-logout por inactividad, igual que el panel de personal.
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

  const clienteActual = sesion ? clientes.find((c) => c.id === sesion.id) || null : null

  /** Edición de perfil: nombre, correo, dirección, teléfono y/o clave. */
  const actualizarCliente = (id, cambios) => {
    if (cambios.correo) {
      const correoNuevo = cambios.correo.trim().toLowerCase()
      const enUso = clientes.some((c) => c.id !== id && c.correo.toLowerCase() === correoNuevo)
      if (enUso) return { ok: false, error: 'Ya existe una cuenta de cliente con ese correo.' }
      cambios = { ...cambios, correo: correoNuevo }
    }
    setClientes((actuales) => actuales.map((c) => (c.id === id ? { ...c, ...cambios } : c)))
    return { ok: true }
  }

  const valor = {
    clientes,
    sesion,
    clienteActual,
    existeCorreo,
    registrarCliente,
    iniciarSesion,
    cerrarSesion,
    actualizarCliente,
    generarClaveTemporal,
  }

  return <ClientesContext.Provider value={valor}>{children}</ClientesContext.Provider>
}

export function useClientes() {
  const contexto = useContext(ClientesContext)
  if (!contexto) throw new Error('useClientes debe usarse dentro de <ProveedorClientes>')
  return contexto
}
