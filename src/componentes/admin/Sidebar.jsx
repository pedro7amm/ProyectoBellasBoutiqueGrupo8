import { NavLink } from 'react-router-dom'
import { useSesion } from '../../contexto/SesionContext.jsx'
import { useChat } from '../../contexto/ChatContext.jsx'
import { iniciales } from '../../datos/usuariosAdmin.js'
import {
  IconoBolsaAdmin,
  IconoCampana,
  IconoChatAdmin,
  IconoDashboard,
  IconoEngranaje,
  IconoPersona,
  IconoSalir,
  IconoTicket,
} from './IconosAdmin.jsx'

const enlace = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'text-admin-ink opacity-100' : 'text-admin-ink/50 hover:text-admin-ink hover:opacity-100'
  }`

export default function Sidebar() {
  const { usuarioActual, esAdmin, cerrarSesion } = useSesion()
  const { noLeidos } = useChat()

  return (
    <aside className="flex h-screen w-[218px] shrink-0 flex-col bg-white print:hidden">
      <div className="px-4 py-4">
        <img src="/img/logo.png" alt="Bella Boutique" className="h-12 w-auto" />
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 px-4" aria-label="Panel de administración">
        {esAdmin && (
          <NavLink to="/admin/reportes" className={enlace}>
            <IconoDashboard tamano={20} />
            Reportes
          </NavLink>
        )}
        <NavLink to="/admin/productos" className={enlace}>
          <IconoBolsaAdmin tamano={20} />
          Productos
        </NavLink>
        <NavLink to="/admin/facturacion" className={enlace}>
          <IconoTicket tamano={20} />
          Facturación
        </NavLink>
        <NavLink to="/admin/usuarios" className={enlace}>
          <IconoPersona tamano={20} />
          Usuarios
        </NavLink>
        <NavLink to="/admin/soporte" className={enlace}>
          <IconoChatAdmin tamano={20} />
          Soporte
          {noLeidos > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-primary px-1 text-[10px] font-semibold text-white">
              {noLeidos}
            </span>
          )}
        </NavLink>

        <div className="my-2 border-t border-admin-bg" />

        <NavLink to="/admin/configuracion" className={enlace}>
          <IconoEngranaje tamano={20} />
          Configuración
        </NavLink>
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-admin-ink/40"
          disabled
          aria-label="Notificaciones (próximamente)"
        >
          <IconoCampana tamano={20} />
          Notificaciones
        </button>
      </nav>

      {usuarioActual && (
        <div className="flex items-center gap-3 border-t border-admin-bg px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-admin-bg text-xs font-semibold text-admin-primary">
            {iniciales(usuarioActual.nombre)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-admin-ink">
              {usuarioActual.nombre.split(' ')[0]}
            </p>
            <p className="truncate text-[10px] uppercase tracking-wide text-admin-ink/50">
              {usuarioActual.rol}
            </p>
          </div>
          <button
            type="button"
            onClick={cerrarSesion}
            className="p-1 text-admin-ink/60 transition hover:text-admin-ink"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <IconoSalir tamano={18} />
          </button>
        </div>
      )}
    </aside>
  )
}
