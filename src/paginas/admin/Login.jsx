import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useSesion } from '../../contexto/SesionContext.jsx'
import { IconoCandadoAdmin, IconoPersona } from '../../componentes/admin/IconosAdmin.jsx'

export default function LoginAdmin() {
  const { sesion, iniciarSesion } = useSesion()
  const navegar = useNavigate()
  const ubicacion = useLocation()

  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  if (sesion) {
    return <Navigate to={ubicacion.state?.desde || '/admin/productos'} replace />
  }

  const enviar = (e) => {
    e.preventDefault()
    const resultado = iniciarSesion(usuario, clave)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }
    navegar(ubicacion.state?.desde || '/admin/productos', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 font-admin">
      <div className="w-full max-w-sm rounded-[10px] bg-white px-8 py-10 shadow-sm">
        <img src="/img/logo.png" alt="Bella Boutique" className="mx-auto h-12 w-auto" />
        <h1 className="mt-6 text-center text-xl font-bold text-admin-ink">Panel interno</h1>
        <p className="mt-1 text-center text-sm text-admin-muted">
          Acceso para administradores y vendedores
        </p>

        <form onSubmit={enviar} className="mt-8 space-y-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted">
              <IconoPersona tamano={17} />
            </span>
            <input
              className="admin-input pl-9"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted">
              <IconoCandadoAdmin tamano={17} />
            </span>
            <input
              type="password"
              className="admin-input pl-9"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="rounded-[4px] bg-admin-danger-bg px-3 py-2 text-center text-xs text-admin-danger-text">
              {error}
            </p>
          )}

          <button type="submit" className="admin-boton-oscuro w-full">
            Ingresar
          </button>
        </form>

        <div className="mt-6 rounded-[4px] bg-admin-bg px-4 py-3 text-[11px] text-admin-muted">
          <p className="font-semibold text-admin-ink">Usuarios de prueba</p>
          <p className="mt-1">Administrador — Admin / admin</p>
          <p>Vendedor — MariaBellas / venta123</p>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-xs text-admin-muted underline hover:text-admin-ink"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
