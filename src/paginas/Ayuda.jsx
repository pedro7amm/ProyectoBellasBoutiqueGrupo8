import { useState } from 'react'
import { IconoCorreo, IconoTelefono, IconoUsuario } from '../componentes/Iconos.jsx'

const ASUNTOS = [
  'Estado de mi pedido',
  'Cambios y devoluciones',
  'Tallas y disponibilidad',
  'Facturación',
  'Otro',
]

export default function Ayuda() {
  const [enviado, setEnviado] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    // Acá va el POST a tu backend o servicio de correo.
    setEnviado(true)
  }

  return (
    <>
      <section className="relative h-[45vh] min-h-72 overflow-hidden bg-tinta">
        <img src="/img/ayuda.jpg" alt="" className="h-full w-full object-cover opacity-70" />
        <h1 className="absolute inset-0 flex items-center justify-center px-5 text-center text-5xl font-extrabold leading-tight text-white sm:text-7xl">
          Ayuda al cliente
        </h1>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-16">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-gris">CONTACTANOS</h2>
        <p className="mt-3 text-base font-semibold leading-relaxed">
          ¿Tenés alguna pregunta sobre nuestros productos, pedidos o envíos? Completá el formulario y
          te respondemos lo antes posible.
        </p>

        {enviado ? (
          <div className="mt-10 border border-borde bg-niebla px-6 py-12 text-center">
            <p className="text-lg font-semibold">Mensaje enviado</p>
            <p className="mt-2 text-sm text-gris">
              Te contestamos al correo en un plazo de 24 horas hábiles.
            </p>
            <button type="button" onClick={() => setEnviado(false)} className="boton-linea mt-6">
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-10 space-y-6">
            <div className="relative">
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                <IconoCorreo tamano={18} />
              </span>
              <input type="email" className="campo-linea" placeholder="Correo electrónico" required />
            </div>

            <div className="flex items-center gap-3 border-b border-borde focus-within:border-tinta">
              <span className="text-gris">
                <IconoTelefono tamano={18} />
              </span>
              <span className="text-sm text-gris">+506</span>
              <input
                type="tel"
                className="w-full bg-transparent py-3 text-sm placeholder:text-gris/70 focus:outline-none"
                placeholder="Número de teléfono"
                required
              />
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                <IconoUsuario tamano={18} />
              </span>
              <input className="campo-linea" placeholder="Nombre completo" required />
            </div>

            <select className="campo-linea appearance-none pl-0" aria-label="Asunto" required>
              <option value="">Asunto</option>
              {ASUNTOS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <textarea
              rows={4}
              className="w-full border-b border-borde bg-transparent py-3 text-sm placeholder:text-gris/70 focus:border-tinta focus:outline-none"
              placeholder="Contanos qué necesitás"
              required
            />

            <button type="submit" className="boton-linea w-full">
              Enviar
            </button>
          </form>
        )}
      </section>
    </>
  )
}
