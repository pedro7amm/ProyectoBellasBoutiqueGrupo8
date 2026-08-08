import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useBitacora } from './BitacoraContext.jsx'

const ChatContext = createContext(null)

// A propósito NO usa sessionStorage: sessionStorage no se comparte entre pestañas,
// así que un chat cliente-vendedor nunca se vería entre ellas. localStorage sí se
// comparte, y con el evento 'storage' logramos que se actualice solo entre pestañas
// del mismo navegador — sin backend no hay tiempo real real entre dispositivos distintos.
const CLAVE = 'bella-boutique-chat'

const leer = () => {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

const guardar = (mensajes) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(mensajes))
  } catch {
    /* localStorage lleno o bloqueado: el chat sigue funcionando en memoria de esta pestaña */
  }
}

export function ProveedorChat({ children }) {
  const [mensajes, setMensajes] = useState(leer)
  const { registrarEvento } = useBitacora()

  useEffect(() => guardar(mensajes), [mensajes])

  // Escucha cambios que vengan de OTRA pestaña (por ejemplo el panel de vendedor)
  // para que el chat se sienta "en vivo" sin recargar la página.
  useEffect(() => {
    const alCambiarStorage = (e) => {
      if (e.key === CLAVE) setMensajes(leer())
    }
    window.addEventListener('storage', alCambiarStorage)
    return () => window.removeEventListener('storage', alCambiarStorage)
  }, [])

  const enviarMensaje = ({ clienteId, clienteNombre, de, autor, texto }) => {
    setMensajes((actuales) => [
      ...actuales,
      {
        id: Date.now() + Math.random(),
        clienteId,
        clienteNombre,
        de, // 'cliente' | 'staff'
        autor,
        texto,
        fecha: new Date().toISOString(),
        // Los mensajes del cliente arrancan sin leer por el personal; los del personal
        // no aplican (los mandó el propio staff).
        leido: de === 'staff',
      },
    ])
    if (de === 'staff') {
      registrarEvento({
        actor: autor,
        accion: 'alta',
        modulo: 'Soporte',
        descripcion: `Respondió por chat a ${clienteNombre}.`,
      })
    }
  }

  /**
   * El personal marca como leída toda la conversación con un cliente al abrirla.
   * useCallback + el "if no hay nada que marcar, no toques el estado" son a propósito:
   * sin esto, cada vez que este componente se re-renderiza se crea una función nueva,
   * el efecto que la usa (en Soporte.jsx) se dispara de nuevo, vuelve a llamar a esto,
   * y entra en un bucle infinito de renders (eso era el contador de errores subiendo solo).
   */
  const marcarLeidos = useCallback((clienteId) => {
    setMensajes((actuales) => {
      const hayAlgoQueMarcar = actuales.some(
        (m) => m.clienteId === clienteId && m.de === 'cliente' && !m.leido,
      )
      if (!hayAlgoQueMarcar) return actuales // sin cambios reales: no generar un array nuevo
      return actuales.map((m) =>
        m.clienteId === clienteId && m.de === 'cliente' ? { ...m, leido: true } : m,
      )
    })
  }, [])

  const noLeidos = mensajes.filter((m) => m.de === 'cliente' && !m.leido).length

  const mensajesDeCliente = (clienteId) => mensajes.filter((m) => m.clienteId === clienteId)

  const conversaciones = () => {
    const porCliente = new Map()
    mensajes.forEach((m) => {
      if (!porCliente.has(m.clienteId)) {
        porCliente.set(m.clienteId, { clienteId: m.clienteId, clienteNombre: m.clienteNombre })
      }
    })
    return [...porCliente.values()]
  }

  const valor = { mensajes, enviarMensaje, mensajesDeCliente, conversaciones, marcarLeidos, noLeidos }

  return <ChatContext.Provider value={valor}>{children}</ChatContext.Provider>
}

export function useChat() {
  const contexto = useContext(ChatContext)
  if (!contexto) throw new Error('useChat debe usarse dentro de <ProveedorChat>')
  return contexto
}
