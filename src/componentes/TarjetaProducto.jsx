import { useState } from 'react'
import { colones, useCarrito } from '../contexto/CarritoContext.jsx'
import { IconoCorazon, IconoEstrella } from './Iconos.jsx'

export default function TarjetaProducto({ producto }) {
  const { agregar } = useCarrito()
  const [talla, setTalla] = useState(producto.tallas[0])
  const [favorito, setFavorito] = useState(false)
  const [agregado, setAgregado] = useState(false)

  const sinStock = producto.stock === 0

  const alAgregar = () => {
    agregar(producto, talla)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1600)
  }

  return (
    <article className="group flex flex-col bg-white">
      <div className="relative aspect-4/5 overflow-hidden bg-humo">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
        />

        {producto.etiqueta && (
          <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[11px] font-medium shadow-sm">
            {producto.etiqueta}
          </span>
        )}

        <button
          type="button"
          onClick={() => setFavorito((v) => !v)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
          aria-pressed={favorito}
          aria-label={`${favorito ? 'Quitar de' : 'Agregar a'} favoritos: ${producto.nombre}`}
        >
          <IconoCorazon tamano={17} relleno={favorito} />
        </button>

        {/* Tallas: visibles siempre en móvil, al pasar el mouse en escritorio */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 px-4 py-3 transition duration-300 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          <p className="mb-2 text-center text-[11px] font-semibold tracking-wide">Talla</p>
          <div className="flex flex-wrap justify-center gap-2">
            {producto.tallas.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTalla(t)}
                aria-pressed={talla === t}
                className={`h-8 w-8 rounded-full border text-[11px] transition ${
                  talla === t
                    ? 'border-tinta bg-tinta text-white'
                    : 'border-borde text-gris hover:border-tinta hover:text-tinta'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-sm font-semibold">{producto.nombre}</h3>
        <p className="mt-1 text-xs text-gris">{producto.descripcion}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-gris">
          <span className="flex items-center gap-1">
            <span className="text-estrella">
              <IconoEstrella tamano={13} />
            </span>
            {producto.calificacion}
          </span>
          <span>·</span>
          <span>{producto.categoria}</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-bold">{colones(producto.precio)}</span>
          {producto.precioAnterior && (
            <span className="text-xs text-gris line-through">{colones(producto.precioAnterior)}</span>
          )}
        </div>

        <p className="mt-1 text-[11px] text-gris">
          {sinStock ? 'Agotado' : `${producto.stock} disponibles · ${producto.proveedor}`}
        </p>

        <button
          type="button"
          onClick={alAgregar}
          disabled={sinStock}
          className="boton-solido mt-4 w-full rounded-full px-4 py-3 text-xs"
        >
          {agregado ? 'Agregado al carrito' : 'Añadir al carrito'}
        </button>
      </div>
    </article>
  )
}
