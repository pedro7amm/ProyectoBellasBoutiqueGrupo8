import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../contexto/CarritoContext.jsx'
import {
  IconoBolsa,
  IconoBuscar,
  IconoCorazon,
  IconoMenu,
  IconoUsuario,
} from './Iconos.jsx'

const BENEFICIOS = ['Mejor calidad', 'Entrega rápida', '100% Original', 'Confiable']

export default function Encabezado({ alAbrirMenu, alAbrirCuenta }) {
  const { unidades } = useCarrito()
  const navegar = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Franja de beneficios */}
      <div className="border-b border-borde/60">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-1 px-5 py-2 text-center text-[11px] tracking-wide text-gris sm:grid-cols-4">
          {BENEFICIOS.map((beneficio) => (
            <li key={beneficio}>{beneficio}</li>
          ))}
        </ul>
      </div>

      {/* Barra principal */}
      <div className="border-b border-borde/60">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={alAbrirMenu}
            className="p-2 -ml-2 transition hover:opacity-60"
            aria-label="Abrir menú"
          >
            <IconoMenu tamano={24} />
          </button>

          <Link
            to="/"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            aria-label="Bella Boutique, ir al inicio"
          >
            <img src="/img/logo.png" alt="Bella Boutique" className="h-9 w-auto" />
          </Link>

          <nav className="flex items-center gap-1" aria-label="Accesos rápidos">
            <button
              type="button"
              onClick={() => navegar('/catalogo')}
              className="p-2 transition hover:opacity-60"
              aria-label="Buscar productos"
            >
              <IconoBuscar tamano={22} />
            </button>
            <button
              type="button"
              onClick={alAbrirCuenta}
              className="p-2 transition hover:opacity-60"
              aria-label="Iniciar sesión"
            >
              <IconoUsuario tamano={22} />
            </button>
            <Link to="/catalogo" className="p-2 transition hover:opacity-60" aria-label="Favoritos">
              <IconoCorazon tamano={22} />
            </Link>
            <Link
              to="/carrito"
              className="relative p-2 transition hover:opacity-60"
              aria-label={`Carrito, ${unidades} artículo${unidades === 1 ? '' : 's'}`}
            >
              <IconoBolsa tamano={22} />
              {unidades > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-tinta px-1 text-[10px] font-semibold text-white">
                  {unidades}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
