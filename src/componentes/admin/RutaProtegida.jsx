import { Navigate, useLocation } from 'react-router-dom'
import { useSesion } from '../../contexto/SesionContext.jsx'

export default function RutaProtegida({ children, soloAdmin = false }) {
  const { sesion, esAdmin } = useSesion()
  const ubicacion = useLocation()

  if (!sesion) {
    return <Navigate to="/admin/login" state={{ desde: ubicacion.pathname }} replace />
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/admin/productos" replace />
  }

  return children
}
