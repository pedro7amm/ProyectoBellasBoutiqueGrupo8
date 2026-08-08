import { useMemo, useState } from 'react'
import { useSesion } from '../../contexto/SesionContext.jsx'
import { ROLES, iniciales } from '../../datos/usuariosAdmin.js'
import EstadoBadge from '../../componentes/admin/EstadoBadge.jsx'
import { IconoLapiz, IconoTacho, IconoUsuarioMas } from '../../componentes/admin/IconosAdmin.jsx'

const VACIO = { usuario: '', nombre: '', correo: '', clave: '', rol: ROLES[1], estado: 'Activo' }

function FormularioUsuario({ inicial, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(inicial || VACIO)
  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onGuardar(datos)
      }}
      className="admin-card mb-5 grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <label className="flex flex-col gap-1 text-sm">
        Usuario
        <input required value={datos.usuario} onChange={cambiar('usuario')} className="admin-input" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Nombre completo
        <input required value={datos.nombre} onChange={cambiar('nombre')} className="admin-input" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Correo
        <input
          type="email"
          required
          value={datos.correo}
          onChange={cambiar('correo')}
          className="admin-input"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Contraseña
        <input
          required={!inicial}
          placeholder={inicial ? 'Dejar igual' : ''}
          value={datos.clave}
          onChange={cambiar('clave')}
          className="admin-input"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Rol
        <select value={datos.rol} onChange={cambiar('rol')} className="admin-input">
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Estado
        <select value={datos.estado} onChange={cambiar('estado')} className="admin-input">
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </label>

      <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
        <button type="submit" className="admin-boton-oscuro">
          Guardar
        </button>
        <button type="button" onClick={onCancelar} className="admin-boton-claro">
          Cancelar
        </button>
      </div>
    </form>
  )
}

function FormularioSoloNombre({ inicial, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(inicial.nombre)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onGuardar({ nombre })
      }}
      className="admin-card mb-5 flex flex-wrap items-end gap-4 px-6 py-5"
    >
      <label className="flex flex-col gap-1 text-sm">
        Nombre completo
        <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="admin-input" />
      </label>
      <p className="text-xs text-admin-muted">
        Como vendedor, solo podés actualizar tu nombre. El usuario, correo, rol y estado los
        maneja un administrador.
      </p>
      <div className="flex gap-3">
        <button type="submit" className="admin-boton-oscuro">
          Guardar
        </button>
        <button type="button" onClick={onCancelar} className="admin-boton-claro">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function UsuariosAdmin() {
  const { usuarios, usuarioActual, esAdmin, agregarUsuario, editarUsuario, eliminarUsuario } =
    useSesion()

  const [filtroNombre, setFiltroNombre] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [creando, setCreando] = useState(false)

  const resultados = useMemo(() => {
    return usuarios.filter((u) => {
      if (filtroNombre && !u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) return false
      if (filtroRol && u.rol !== filtroRol) return false
      if (filtroEstado && u.estado !== filtroEstado) return false
      return true
    })
  }, [usuarios, filtroNombre, filtroRol, filtroEstado])

  const confirmarEliminar = (usuario) => {
    if (usuario.id === usuarioActual?.id) {
      window.alert('No podés eliminar tu propio usuario mientras tenés la sesión abierta.')
      return
    }
    if (window.confirm(`¿Eliminar a ${usuario.nombre}?`)) eliminarUsuario(usuario.id)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-ink">Mantenimiento de Usuarios</h1>

      <div className="admin-card mt-6 flex flex-wrap items-end gap-4 px-6 py-5">
        <label className="flex flex-col gap-1 text-xs text-admin-muted">
          Nombre de usuario
          <input
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="Buscar por nombre"
            className="admin-input w-48"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-admin-muted">
          Rol
          <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="admin-input w-40">
            <option value="">Todos los roles</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-admin-muted">
          Estado
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="admin-input w-36"
          >
            <option value="">Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </label>

        {esAdmin && (
          <button
            type="button"
            onClick={() => {
              setCreando((v) => !v)
              setEditandoId(null)
            }}
            className="admin-boton-claro ml-auto flex items-center gap-2"
          >
            <IconoUsuarioMas tamano={16} />
            Nuevo usuario
          </button>
        )}
      </div>

      <p className="mt-4 text-sm font-bold text-admin-ink">Total : {resultados.length} usuarios</p>

      {creando && esAdmin && (
        <div className="mt-4">
          <FormularioUsuario
            onGuardar={(datos) => {
              agregarUsuario(datos)
              setCreando(false)
            }}
            onCancelar={() => setCreando(false)}
          />
        </div>
      )}

      <div className="admin-card mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="text-sm text-admin-muted">
              <th className="py-4 pl-6 pr-3 font-normal">Usuario</th>
              <th className="px-3 py-4 font-normal">Nombre</th>
              <th className="px-3 py-4 font-normal">Correo</th>
              <th className="px-3 py-4 font-normal">Rol</th>
              <th className="px-3 py-4 font-normal">Estado</th>
              <th className="py-4 pl-3 pr-6 font-normal">Acción</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((usuario) => {
              const esPropio = usuario.id === usuarioActual?.id
              const puedeEditar = esAdmin || esPropio
              const FormularioEdicion = esAdmin ? FormularioUsuario : FormularioSoloNombre

              return editandoId === usuario.id ? (
                <tr key={usuario.id}>
                  <td colSpan={6} className="px-6 py-4">
                    <FormularioEdicion
                      inicial={usuario}
                      onGuardar={(datos) => {
                        editarUsuario(usuario.id, datos)
                        setEditandoId(null)
                      }}
                      onCancelar={() => setEditandoId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={usuario.id} className="border-t border-admin-bg text-sm">
                  <td className="flex items-center gap-3 py-4 pl-6 pr-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-bg text-[11px] font-semibold text-admin-primary">
                      {iniciales(usuario.nombre)}
                    </span>
                    {usuario.usuario}
                  </td>
                  <td className="px-3 py-4 text-admin-ink">{usuario.nombre}</td>
                  <td className="px-3 py-4 text-admin-ink">{usuario.correo}</td>
                  <td className="px-3 py-4 text-admin-ink">{usuario.rol}</td>
                  <td className="px-3 py-4">
                    <EstadoBadge
                      estado={usuario.estado}
                      tono={usuario.estado === 'Activo' ? 'positivo' : 'negativo'}
                      estilo="pastilla"
                    />
                  </td>
                  <td className="py-4 pl-3 pr-6">
                    <div className="flex gap-4">
                      {puedeEditar && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditandoId(usuario.id)
                            setCreando(false)
                          }}
                          className="text-admin-ink transition hover:text-admin-primary"
                          aria-label={`Editar a ${usuario.nombre}`}
                        >
                          <IconoLapiz tamano={16} />
                        </button>
                      )}
                      {esAdmin && (
                        <button
                          type="button"
                          onClick={() => confirmarEliminar(usuario)}
                          className="text-admin-ink transition hover:text-admin-danger-text"
                          aria-label={`Eliminar a ${usuario.nombre}`}
                        >
                          <IconoTacho tamano={16} />
                        </button>
                      )}
                      {!puedeEditar && !esAdmin && <span className="text-admin-muted">—</span>}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
