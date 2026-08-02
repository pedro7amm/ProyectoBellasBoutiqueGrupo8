import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TarjetaProducto from '../componentes/TarjetaProducto.jsx'
import { CATEGORIAS, TALLAS, productos } from '../datos/productos.js'
import { colones } from '../contexto/CarritoContext.jsx'
import { IconoBuscar, IconoFiltro } from '../componentes/Iconos.jsx'

const PRECIO_MAXIMO = 30000

export default function Catalogo() {
  const [parametros, setParametros] = useSearchParams()
  const soloOfertas = parametros.get('oferta') === '1'

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState(parametros.get('categoria') || '')
  const [tallasElegidas, setTallasElegidas] = useState([])
  const [precioTope, setPrecioTope] = useState(PRECIO_MAXIMO)
  const [orden, setOrden] = useState('relevancia')
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const alternarTalla = (talla) =>
    setTallasElegidas((actuales) =>
      actuales.includes(talla) ? actuales.filter((t) => t !== talla) : [...actuales, talla],
    )

  const cambiarCategoria = (valor) => {
    setCategoria(valor)
    const nuevos = new URLSearchParams(parametros)
    valor ? nuevos.set('categoria', valor) : nuevos.delete('categoria')
    setParametros(nuevos, { replace: true })
  }

  const limpiar = () => {
    setBusqueda('')
    setTallasElegidas([])
    setPrecioTope(PRECIO_MAXIMO)
    setOrden('relevancia')
    cambiarCategoria('')
    const nuevos = new URLSearchParams(parametros)
    nuevos.delete('oferta')
    setParametros(nuevos, { replace: true })
  }

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    const filtrados = productos.filter((p) => {
      if (texto && !`${p.nombre} ${p.descripcion} ${p.categoria}`.toLowerCase().includes(texto))
        return false
      if (categoria && p.categoria !== categoria) return false
      if (tallasElegidas.length && !p.tallas.some((t) => tallasElegidas.includes(t))) return false
      if (p.precio > precioTope) return false
      if (soloOfertas && !p.precioAnterior) return false
      return true
    })

    const ordenados = [...filtrados]
    if (orden === 'precio-asc') ordenados.sort((a, b) => a.precio - b.precio)
    if (orden === 'precio-desc') ordenados.sort((a, b) => b.precio - a.precio)
    if (orden === 'calificacion') ordenados.sort((a, b) => b.calificacion - a.calificacion)
    return ordenados
  }, [busqueda, categoria, tallasElegidas, precioTope, orden, soloOfertas])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      {/* Buscador */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-borde px-5 py-3">
          <IconoBuscar tamano={18} />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar prendas, categorías…"
            aria-label="Buscar en el catálogo"
            className="w-full bg-transparent text-sm placeholder:text-gris focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          className="flex items-center gap-2 self-start text-sm text-gris transition hover:text-tinta lg:hidden"
          aria-expanded={filtrosAbiertos}
        >
          <IconoFiltro tamano={18} />
          Filtros
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Filtros */}
        <aside className={`${filtrosAbiertos ? 'block' : 'hidden'} lg:block`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-[0.2em]">FILTROS</h2>
            <button
              type="button"
              onClick={limpiar}
              className="text-xs text-gris underline transition hover:text-tinta"
            >
              Limpiar
            </button>
          </div>

          <div className="mt-6 border-t border-borde pt-6">
            <h3 className="text-xs font-semibold tracking-wide">Categoría</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => cambiarCategoria('')}
                  className={categoria === '' ? 'font-semibold' : 'text-gris hover:text-tinta'}
                >
                  Todas
                </button>
              </li>
              {CATEGORIAS.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => cambiarCategoria(c)}
                    className={categoria === c ? 'font-semibold' : 'text-gris hover:text-tinta'}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-borde pt-6">
            <h3 className="text-xs font-semibold tracking-wide">Talla</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {TALLAS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => alternarTalla(t)}
                  aria-pressed={tallasElegidas.includes(t)}
                  className={`h-9 w-9 rounded-full border text-xs transition ${
                    tallasElegidas.includes(t)
                      ? 'border-tinta bg-tinta text-white'
                      : 'border-borde text-gris hover:border-tinta hover:text-tinta'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-borde pt-6">
            <h3 className="text-xs font-semibold tracking-wide">Precio</h3>
            <input
              type="range"
              min={5000}
              max={PRECIO_MAXIMO}
              step={1000}
              value={precioTope}
              onChange={(e) => setPrecioTope(Number(e.target.value))}
              className="mt-4 w-full accent-tinta"
              aria-label="Precio máximo"
            />
            <p className="mt-2 text-xs text-gris">Hasta {colones(precioTope)}</p>
          </div>

          <div className="mt-6 border-t border-borde pt-6">
            <label htmlFor="orden" className="text-xs font-semibold tracking-wide">
              Ordenar por
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="mt-3 w-full border border-borde bg-white px-3 py-2 text-sm focus:border-tinta focus:outline-none"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="calificacion">Mejor calificados</option>
            </select>
          </div>
        </aside>

        {/* Resultados */}
        <section>
          <div className="flex items-baseline justify-between">
            <h1 className="titulo-seccion">
              {soloOfertas ? 'Ofertas' : categoria || 'Catálogo de productos'}
            </h1>
            <p className="text-xs text-gris">
              {resultados.length} {resultados.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          {resultados.length === 0 ? (
            <div className="mt-16 border border-dashed border-borde px-6 py-20 text-center">
              <p className="text-sm font-semibold">No hay prendas con esos filtros</p>
              <p className="mt-2 text-sm text-gris">
                Probá quitar la talla o subir el precio máximo.
              </p>
              <button type="button" onClick={limpiar} className="boton-solido mt-6">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 xl:grid-cols-3">
              {resultados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
