import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIAS } from '../datos/productos.js'
import { IconoCerrar, IconoChevron } from './Iconos.jsx'

export default function MenuLateral({ abierto, alCerrar }) {
  const [tiendaAbierta, setTiendaAbierta] = useState(true)

  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && alCerrar()
    if (abierto) {
      document.addEventListener('keydown', alPresionar)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = ''
    }
  }, [abierto, alCerrar])

  return (
    <>
      <div
        onClick={alCerrar}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          abierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-lg flex-col bg-white transition-transform duration-300 ease-out ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menú principal"
        aria-hidden={!abierto}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <button
            type="button"
            onClick={alCerrar}
            className="p-2 -ml-2 transition hover:opacity-60"
            aria-label="Cerrar menú"
          >
            <IconoCerrar tamano={24} />
          </button>
          <img src="/img/logo.png" alt="" className="h-8 w-auto opacity-90" />
        </div>

        <nav className="flex-1 overflow-y-auto px-8 pb-10 pt-6">
          <Link
            to="/"
            onClick={alCerrar}
            className="block py-4 text-sm font-semibold tracking-[0.2em] transition hover:opacity-60"
          >
            INICIO
          </Link>

          <Link
            to="/catalogo?oferta=1"
            onClick={alCerrar}
            className="block py-4 text-sm font-semibold tracking-[0.2em] transition hover:opacity-60"
          >
            OFERTAS
          </Link>

          <div className="py-4">
            <button
              type="button"
              onClick={() => setTiendaAbierta((v) => !v)}
              className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] transition hover:opacity-60"
              aria-expanded={tiendaAbierta}
            >
              <span className="h-px w-8 bg-tinta" aria-hidden="true" />
              TIENDA
              <IconoChevron tamano={16} direccion={tiendaAbierta ? 'arriba' : 'abajo'} />
            </button>

            {tiendaAbierta && (
              <ul className="mt-4 space-y-3 pl-11">
                {CATEGORIAS.map((categoria) => (
                  <li key={categoria}>
                    <Link
                      to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                      onClick={alCerrar}
                      className="block text-sm text-gris transition hover:text-tinta"
                    >
                      {categoria}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/ayuda"
            onClick={alCerrar}
            className="block py-4 text-sm font-semibold tracking-[0.2em] transition hover:opacity-60"
          >
            CONTACTO
          </Link>
        </nav>

        <p className="px-8 pb-8 text-[11px] uppercase tracking-[0.35em] text-gris">
          Feliz compra
        </p>
      </aside>
    </>
  )
}
