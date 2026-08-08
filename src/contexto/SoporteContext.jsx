import { createContext, useContext, useEffect, useState } from 'react'
import { useBitacora } from './BitacoraContext.jsx'

const SoporteContext = createContext(null)

const CLAVE_ENCUESTAS = 'bella-boutique-encuestas'
const CLAVE_SUGERENCIAS = 'bella-boutique-sugerencias'

const leer = (clave) => {
  try {
    const guardado = sessionStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

const guardar = (clave, valor) => {
  try {
    sessionStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* sessionStorage lleno o bloqueado: sigue funcionando en memoria */
  }
}

export function ProveedorSoporte({ children }) {
  const [encuestas, setEncuestas] = useState(() => leer(CLAVE_ENCUESTAS))
  const [sugerencias, setSugerencias] = useState(() => leer(CLAVE_SUGERENCIAS))
  const { registrarEvento } = useBitacora()

  useEffect(() => guardar(CLAVE_ENCUESTAS, encuestas), [encuestas])
  useEffect(() => guardar(CLAVE_SUGERENCIAS, sugerencias), [sugerencias])

  const enviarEncuesta = ({ autor, puntaje, comentario }) => {
    setEncuestas((actuales) => [
      { id: Date.now(), autor, puntaje, comentario, fecha: new Date().toISOString() },
      ...actuales,
    ])
    registrarEvento({
      actor: autor,
      accion: 'alta',
      modulo: 'Soporte',
      descripcion: `Envió una encuesta de satisfacción (${puntaje}/5).`,
    })
  }

  const enviarSugerencia = ({ autor, correo, asunto, mensaje }) => {
    setSugerencias((actuales) => [
      { id: Date.now(), autor, correo, asunto, mensaje, fecha: new Date().toISOString() },
      ...actuales,
    ])
    registrarEvento({
      actor: autor,
      accion: 'alta',
      modulo: 'Soporte',
      descripcion: `Envió una sugerencia: "${asunto}".`,
    })
  }

  const valor = { encuestas, sugerencias, enviarEncuesta, enviarSugerencia }

  return <SoporteContext.Provider value={valor}>{children}</SoporteContext.Provider>
}

export function useSoporte() {
  const contexto = useContext(SoporteContext)
  if (!contexto) throw new Error('useSoporte debe usarse dentro de <ProveedorSoporte>')
  return contexto
}
