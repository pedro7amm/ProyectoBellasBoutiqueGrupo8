import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useClientes } from '../contexto/ClientesContext.jsx'

const Campo = ({ etiqueta, ...props }) => (
  <label className="flex flex-col gap-1 text-sm">
    {etiqueta}
    <input className="campo-linea" {...props} />
  </label>
)

export default function CuentaCliente() {
  const { clienteActual, actualizarCliente } = useClientes()
  const [datos, setDatos] = useState(() =>
    clienteActual
      ? {
          nombre: clienteActual.nombre || '',
          apellidos: clienteActual.apellidos || '',
          correo: clienteActual.correo || '',
          telefono: clienteActual.telefono || '',
          direccion: clienteActual.direccion || '',
        }
      : null,
  )
  const [claveNueva, setClaveNueva] = useState('')
  const [mensaje, setMensaje] = useState('')

  if (!clienteActual) return <Navigate to="/" replace />

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value })

  const guardar = (e) => {
    e.preventDefault()
    const cambios = { ...datos }
    if (claveNueva) cambios.clave = claveNueva

    const resultado = actualizarCliente(clienteActual.id, cambios)
    if (resultado.ok) {
      setClaveNueva('')
      setMensaje('Tus datos se actualizaron correctamente.')
      setTimeout(() => setMensaje(''), 3000)
    } else {
      setMensaje(resultado.error)
    }
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-12">
      <h1 className="titulo-seccion">Configuración de cuenta</h1>

      <form onSubmit={guardar} className="mt-10 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Campo etiqueta="Nombre" value={datos.nombre} onChange={cambiar('nombre')} required />
          <Campo
            etiqueta="Apellidos"
            value={datos.apellidos}
            onChange={cambiar('apellidos')}
            required
          />
        </div>

        <Campo
          etiqueta="Correo electrónico"
          type="email"
          value={datos.correo}
          onChange={cambiar('correo')}
          required
        />
        <Campo etiqueta="Teléfono" value={datos.telefono} onChange={cambiar('telefono')} />
        <Campo etiqueta="Dirección" value={datos.direccion} onChange={cambiar('direccion')} />

        <Campo
          etiqueta="Nueva contraseña (dejalo vacío para no cambiarla)"
          type="password"
          minLength={8}
          value={claveNueva}
          onChange={(e) => setClaveNueva(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />

        {mensaje && <p className="text-sm text-tinta">{mensaje}</p>}

        <button type="submit" className="boton-solido w-full">
          Guardar cambios
        </button>
      </form>
    </section>
  )
}
