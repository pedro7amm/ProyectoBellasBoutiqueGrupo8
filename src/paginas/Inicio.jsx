import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TarjetaProducto from '../componentes/TarjetaProducto.jsx'
import { CATEGORIAS, productos } from '../datos/productos.js'
import { IconoFlecha } from '../componentes/Iconos.jsx'

const DIAPOSITIVAS = [
  { imagen: '/img/hero.jpg', titulo: 'CHOOSE', subtitulo: 'YOUR STYLE.' },
  { imagen: '/img/banner.jpg', titulo: 'NUEVA', subtitulo: 'TEMPORADA.' },
]

function Hero() {
  const [actual, setActual] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActual((i) => (i + 1) % DIAPOSITIVAS.length), 7000)
    return () => clearInterval(t)
  }, [])

  const mover = (paso) =>
    setActual((i) => (i + paso + DIAPOSITIVAS.length) % DIAPOSITIVAS.length)

  return (
    <section className="relative h-[70vh] min-h-100 overflow-hidden bg-tinta sm:h-[78vh]">
      {DIAPOSITIVAS.map((d, i) => (
        <img
          key={d.imagen}
          src={d.imagen}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === actual ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black/25" />

      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[15vw] font-extrabold leading-[0.85] tracking-tight text-white/40 sm:text-[11vw]">
          {DIAPOSITIVAS[actual].titulo}
          <br />
          {DIAPOSITIVAS[actual].subtitulo}
        </h1>

        <Link
          to="/catalogo"
          className="mt-10 border-b-2 border-white pb-1 text-sm font-semibold tracking-[0.2em] text-white transition hover:opacity-70"
        >
          COMPRAR AHORA &gt;&gt;
        </Link>
      </div>

      {[
        { paso: -1, clase: 'left-4', direccion: 'izquierda', etiqueta: 'Anterior' },
        { paso: 1, clase: 'right-4', direccion: 'derecha', etiqueta: 'Siguiente' },
      ].map((b) => (
        <button
          key={b.etiqueta}
          type="button"
          onClick={() => mover(b.paso)}
          aria-label={b.etiqueta}
          className={`absolute top-1/2 ${b.clase} flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/40`}
        >
          <IconoFlecha tamano={20} direccion={b.direccion} />
        </button>
      ))}
    </section>
  )
}

export default function Inicio() {
  const destacados = productos.slice(0, 4)

  return (
    <>
      <Hero />

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="titulo-seccion">Comprá por categoría</h2>
          <Link to="/catalogo" className="text-sm text-gris underline transition hover:text-tinta">
            Ver todo
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-3">
          {CATEGORIAS.map((categoria) => (
            <li key={categoria}>
              <Link
                to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                className="inline-block rounded-full border border-borde px-6 py-3 text-sm transition hover:border-tinta hover:bg-humo"
              >
                {categoria}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Banner de ofertas */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-tinta px-8 py-10 sm:flex-row sm:justify-between sm:py-0 sm:pl-14">
          <div className="text-center sm:py-12 sm:text-left">
            <h2 className="text-2xl font-extrabold text-white sm:text-4xl">OFERTAS DISPONIBLES</h2>
            <Link
              to="/catalogo?oferta=1"
              className="mt-6 inline-block rounded-full border border-white px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-tinta"
            >
              VER AQUÍ
            </Link>
          </div>
          <img
            src="/img/ofertas.jpg"
            alt=""
            className="w-full max-w-sm object-contain sm:w-1/2"
            loading="lazy"
          />
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="titulo-seccion">Catálogo de productos</h2>
        <p className="mt-2 text-sm text-gris">Lo más buscado esta semana.</p>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {destacados.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/catalogo" className="boton-linea">
            Ver todo el catálogo
          </Link>
        </div>
      </section>
    </>
  )
}
