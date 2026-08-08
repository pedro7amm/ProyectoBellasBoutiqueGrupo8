import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useClientes } from '../contexto/ClientesContext.jsx'
import { IconoCaja, IconoEngranaje, IconoSalir } from './Iconos.jsx'

export default function MenuCuenta() {
  const { clienteActual, cerrarSesion } = useClientes()
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)

  useEffect(() => {
    const alHacerClicFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', alHacerClicFuera)
    return () => document.removeEventListener('mousedown', alHacerClicFuera)
  }, [])

  if (!clienteActual) return null

  const iniciales = `${clienteActual.nombre?.[0] || ''}${clienteActual.apellidos?.[0] || ''}`.toUpperCase()

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-tinta text-xs font-semibold text-white transition hover:opacity-80"
        aria-haspopup="true"
        aria-expanded={abierto}
        aria-label="Mi cuenta"
      >
        {iniciales || <IconoCaja tamano={16} />}
      </button>

      {abierto && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-borde bg-white py-2 shadow-lg">
          <p className="border-b border-borde px-4 pb-3 text-sm">
            Hola, <span className="font-semibold">{clienteActual.nombre}</span>
          </p>
          <Link
            to="/mis-pedidos"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-niebla"
          >
            <IconoCaja tamano={16} />
            Mis pedidos
          </Link>
          <Link
            to="/cuenta"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-niebla"
          >
            <IconoEngranaje tamano={16} />
            Configuración
          </Link>
          <button
            type="button"
            onClick={() => {
              cerrarSesion()
              setAbierto(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gris transition hover:bg-niebla hover:text-tinta"
          >
            <IconoSalir tamano={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
