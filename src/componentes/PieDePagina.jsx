import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconoCorreo,
  IconoFacebook,
  IconoFlecha,
  IconoInstagram,
  IconoTarjeta,
  IconoTelefono,
  IconoTwitter,
} from './Iconos.jsx'

export default function PieDePagina() {
  const [correo, setCorreo] = useState('')
  const [suscrito, setSuscrito] = useState(false)

  const suscribir = (e) => {
    e.preventDefault()
    if (!correo) return
    setSuscrito(true)
    setCorreo('')
  }

  return (
    <footer className="mt-24">
      {/* Suscripción */}
      <div className="mx-auto max-w-7xl px-5 pb-12">
        <h2 className="text-sm font-bold tracking-[0.2em]">SUSCRÍBETE</h2>
        <form onSubmit={suscribir} className="mt-4 flex max-w-md items-center gap-3 border-b border-tinta">
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo electrónico"
            aria-label="Correo electrónico"
            className="w-full bg-transparent py-2 text-sm placeholder:text-gris focus:outline-none"
            required
          />
          <button type="submit" className="p-2 transition hover:opacity-60" aria-label="Suscribirse">
            <IconoFlecha tamano={20} />
          </button>
        </form>
        {suscrito && (
          <p className="mt-3 text-xs text-gris">Listo, te escribimos cuando entren novedades.</p>
        )}
      </div>

      {/* Columnas */}
      <div className="border-t border-borde bg-niebla">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/img/logo.png" alt="Bella Boutique" className="h-10 w-auto" />
            <div className="mt-6 flex gap-3">
              {[IconoFacebook, IconoTwitter, IconoInstagram].map((Icono, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-borde bg-white transition hover:border-tinta"
                  aria-label="Red social de Bella Boutique"
                >
                  <Icono tamano={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Método de pago</h3>
            <ul className="mt-5 space-y-3 text-sm text-gris">
              {['Visa', 'MasterCard'].map((metodo) => (
                <li key={metodo} className="flex items-center gap-3">
                  <span className="flex h-6 w-9 items-center justify-center rounded border border-borde bg-white">
                    <IconoTarjeta tamano={14} />
                  </span>
                  {metodo}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold">¿Ayuda?</h3>
            <ul className="mt-5 space-y-3 text-sm text-gris">
              <li>
                <Link to="/ayuda" className="transition hover:text-tinta">
                  Ayuda al cliente
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="transition hover:text-tinta">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold">Bella Boutique</h3>
            <ul className="mt-5 space-y-3 text-sm text-gris">
              <li className="flex items-center gap-3">
                <IconoTelefono tamano={16} />
                <a href="tel:+50624456948" className="transition hover:text-tinta">
                  2445-6948
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconoCorreo tamano={16} />
                <a href="mailto:bellaboutique@gmail.com" className="transition hover:text-tinta">
                  bellaboutique@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 bg-tinta py-4 text-center text-xs text-white/80 sm:flex-row sm:justify-center sm:gap-4">
        <span>© {new Date().getFullYear()} Bella Boutique</span>
        <Link to="/admin/login" className="underline transition hover:text-white">
          Acceso interno
        </Link>
      </div>
    </footer>
  )
}
