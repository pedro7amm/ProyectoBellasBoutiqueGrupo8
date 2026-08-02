import { Link, useNavigate } from 'react-router-dom'
import { colones, useCarrito } from '../contexto/CarritoContext.jsx'
import { IconoBasura, IconoMas, IconoMenos } from '../componentes/Iconos.jsx'

export function LineasCarrito({ compacto = false }) {
  const { lineas, cambiarCantidad, quitar } = useCarrito()

  return (
    <ul className="divide-y divide-borde">
      {lineas.map((linea) => (
        <li key={`${linea.id}-${linea.talla}`} className="flex gap-4 py-6">
          <img
            src={linea.imagen}
            alt={linea.nombre}
            className={`${compacto ? 'h-24 w-20' : 'h-32 w-24'} shrink-0 bg-humo object-contain`}
          />

          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold sm:text-base">{linea.nombre}</h3>
              <span className="whitespace-nowrap text-sm font-semibold">
                {colones(linea.precio * linea.cantidad)}
              </span>
            </div>

            <div className="mt-auto flex items-center gap-4 pt-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-borde text-xs">
                {linea.talla}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(linea.id, linea.talla, -1)}
                  className="text-gris transition hover:text-tinta"
                  aria-label={`Quitar una unidad de ${linea.nombre}`}
                >
                  <IconoMenos tamano={22} />
                </button>
                <span className="w-6 text-center text-sm">{linea.cantidad}</span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(linea.id, linea.talla, 1)}
                  disabled={linea.cantidad >= linea.stock}
                  className="text-gris transition hover:text-tinta disabled:opacity-30"
                  aria-label={`Agregar una unidad de ${linea.nombre}`}
                >
                  <IconoMas tamano={22} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => quitar(linea.id, linea.talla)}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-borde text-gris transition hover:border-tinta hover:text-tinta"
                aria-label={`Eliminar ${linea.nombre} del carrito`}
              >
                <IconoBasura tamano={16} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ResumenTotales() {
  const { subtotal, impuesto, total } = useCarrito()

  return (
    <dl className="space-y-3 border-t border-borde pt-5 text-sm">
      <div className="flex justify-between text-gris">
        <dt>Subtotal</dt>
        <dd>{colones(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-gris">
        <dt>IVA 13%</dt>
        <dd>{colones(impuesto)}</dd>
      </div>
      <div className="flex justify-between border-t border-borde pt-3 text-base font-bold">
        <dt>Total</dt>
        <dd>{colones(total)}</dd>
      </div>
    </dl>
  )
}

export default function Carrito() {
  const { lineas, unidades } = useCarrito()
  const navegar = useNavigate()

  if (lineas.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-28 text-center">
        <h1 className="titulo-seccion">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-gris">
          Agregá una prenda y aparecerá acá con su talla y cantidad.
        </p>
        <Link to="/catalogo" className="boton-solido mt-8">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="titulo-seccion">
        Carrito <span className="text-gris">({unidades})</span>
      </h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <LineasCarrito />
        </div>

        <aside className="h-fit bg-niebla p-6 lg:sticky lg:top-40">
          <h2 className="text-sm font-bold tracking-[0.2em]">RESUMEN</h2>
          <div className="mt-5">
            <ResumenTotales />
          </div>
          <button
            type="button"
            onClick={() => navegar('/facturacion')}
            className="boton-solido mt-6 w-full"
          >
            Facturación
          </button>
          <Link
            to="/catalogo"
            className="mt-4 block text-center text-xs text-gris underline transition hover:text-tinta"
          >
            Seguir comprando
          </Link>
        </aside>
      </div>
    </section>
  )
}
