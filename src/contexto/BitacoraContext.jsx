import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const BitacoraContext = createContext(null)

const CLAVE = 'bella-boutique-bitacora'
const MAX_EVENTOS = 500 // evita que la bitácora crezca sin límite dentro de la misma sesión

const leer = () => {
  try {
    const guardado = sessionStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

const guardar = (eventos) => {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(eventos))
  } catch {
    /* sessionStorage lleno o bloqueado: la bitácora sigue funcionando en memoria */
  }
}

// Registra quién hizo qué: altas, bajas, modificaciones y compras en Productos,
// Usuarios (personal), Clientes y Pedidos. La consulta esta accesible al administrador
// desde Reportes → Bitácora.
export function ProveedorBitacora({ children }) {
  const [eventos, setEventos] = useState(leer)

  useEffect(() => guardar(eventos), [eventos])

  const registrarEvento = useCallback(({ actor, accion, modulo, descripcion }) => {
    setEventos((actuales) =>
      [
        {
          id: Date.now() + Math.random(),
          fecha: new Date().toISOString(),
          actor: actor || 'Desconocido',
          accion, // 'alta' | 'baja' | 'modificacion' | 'compra'
          modulo, // 'Productos' | 'Usuarios' | 'Clientes' | 'Pedidos'
          descripcion,
        },
        ...actuales,
      ].slice(0, MAX_EVENTOS),
    )
  }, [])

  return (
    <BitacoraContext.Provider value={{ eventos, registrarEvento }}>
      {children}
    </BitacoraContext.Provider>
  )
}

export function useBitacora() {
  const contexto = useContext(BitacoraContext)
  if (!contexto) throw new Error('useBitacora debe usarse dentro de <ProveedorBitacora>')
  return contexto
}
