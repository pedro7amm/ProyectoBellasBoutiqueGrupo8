import { useState } from 'react'
import { useSesion } from '../../contexto/SesionContext.jsx'

export default function ConfiguracionAdmin() {
  const { usuarioActual, editarUsuario } = useSesion()
  const [nombre, setNombre] = useState(usuarioActual?.nombre || '')
  const [claveActual, setClaveActual] = useState('')
  const [claveNueva, setClaveNueva] = useState('')
  const [mensaje, setMensaje] = useState('')

  const guardarNombre = (e) => {
    e.preventDefault()
    editarUsuario(usuarioActual.id, { nombre })
    setMensaje('Nombre actualizado.')
    setTimeout(() => setMensaje(''), 2500)
  }

  const cambiarClave = (e) => {
    e.preventDefault()
    if (claveActual !== usuarioActual.clave) {
      setMensaje('La contraseña actual no coincide.')
      return
    }
    editarUsuario(usuarioActual.id, { clave: claveNueva })
    setClaveActual('')
    setClaveNueva('')
    setMensaje('Contraseña actualizada.')
    setTimeout(() => setMensaje(''), 2500)
  }

  if (!usuarioActual) return null

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-ink">Configuración</h1>

      {mensaje && (
        <p className="mt-4 rounded-[4px] bg-admin-success-bg px-4 py-2 text-sm text-admin-success-text">
          {mensaje}
        </p>
      )}

      <form onSubmit={guardarNombre} className="admin-card mt-6 max-w-md px-6 py-6">
        <h2 className="text-sm font-bold text-admin-ink">Datos de la cuenta</h2>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          Nombre para mostrar
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="admin-input" />
        </label>
        <p className="mt-2 text-xs text-admin-muted">
          Usuario: {usuarioActual.usuario} · Rol: {usuarioActual.rol}
        </p>
        <button type="submit" className="admin-boton-oscuro mt-4">
          Guardar nombre
        </button>
      </form>

      <form onSubmit={cambiarClave} className="admin-card mt-6 max-w-md px-6 py-6">
        <h2 className="text-sm font-bold text-admin-ink">Cambiar contraseña</h2>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          Contraseña actual
          <input
            type="password"
            value={claveActual}
            onChange={(e) => setClaveActual(e.target.value)}
            className="admin-input"
            required
          />
        </label>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          Contraseña nueva
          <input
            type="password"
            value={claveNueva}
            onChange={(e) => setClaveNueva(e.target.value)}
            className="admin-input"
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="admin-boton-oscuro mt-4">
          Actualizar contraseña
        </button>
      </form>
    </div>
  )
}
