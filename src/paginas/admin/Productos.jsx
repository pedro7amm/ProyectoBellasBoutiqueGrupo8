import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductos } from '../../contexto/ProductosContext.jsx'
import { CATEGORIAS, CATEGORIAS_POR_GENERO, GENEROS, TALLAS } from '../../datos/productos.js'
import TablaProductos from '../../componentes/admin/TablaProductos.jsx'
import { IconoImagen } from '../../componentes/admin/IconosAdmin.jsx'

const FILTROS_VACIOS = { nombre: '', stockMin: '', stockMax: '', categoria: '' }

// No hay backend: la foto se guarda como imagen ya redimensionada (data URL) en sessionStorage.
// La redimensionamos a un ancho máximo para no llenar la cuota de almacenamiento del navegador.
const ANCHO_MAXIMO_IMAGEN = 700

function leerImagenComoDataUrl(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida.'))
      img.onload = () => {
        const escala = Math.min(1, ANCHO_MAXIMO_IMAGEN / img.width)
        const lienzo = document.createElement('canvas')
        lienzo.width = Math.round(img.width * escala)
        lienzo.height = Math.round(img.height * escala)
        const ctx = lienzo.getContext('2d')
        ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height)
        resolve(lienzo.toDataURL('image/jpeg', 0.85))
      }
      img.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })
}

function useFiltroProductos(productos) {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [aplicados, setAplicados] = useState(FILTROS_VACIOS)

  const resultados = useMemo(() => {
    return productos.filter((p) => {
      if (aplicados.nombre && !p.nombre.toLowerCase().includes(aplicados.nombre.toLowerCase()))
        return false
      if (aplicados.categoria && p.categoria !== aplicados.categoria) return false
      if (aplicados.stockMin && p.stock < Number(aplicados.stockMin)) return false
      if (aplicados.stockMax && p.stock > Number(aplicados.stockMax)) return false
      return true
    })
  }, [productos, aplicados])

  return {
    filtros,
    setFiltros,
    resultados,
    buscar: () => setAplicados(filtros),
    reiniciar: () => {
      setFiltros(FILTROS_VACIOS)
      setAplicados(FILTROS_VACIOS)
    },
  }
}

function FiltrosProductos({ filtros, setFiltros, buscar, reiniciar }) {
  const cambiar = (campo) => (e) => setFiltros((f) => ({ ...f, [campo]: e.target.value }))

  return (
    <div className="admin-card flex flex-wrap items-end gap-6 px-6 py-5">
      <label className="flex flex-col gap-1 text-sm">
        Nombre del Producto
        <input
          value={filtros.nombre}
          onChange={cambiar('nombre')}
          className="border-b border-admin-muted/50 bg-transparent py-1 text-sm focus:border-admin-primary focus:outline-none"
          placeholder="Buscar por nombre"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Stock
        <span className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filtros.stockMin}
            onChange={cambiar('stockMin')}
            className="admin-input w-20"
            aria-label="Stock mínimo"
          />
          <span>-</span>
          <input
            type="number"
            min={0}
            value={filtros.stockMax}
            onChange={cambiar('stockMax')}
            className="admin-input w-20"
            aria-label="Stock máximo"
          />
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Categoría
        <select value={filtros.categoria} onChange={cambiar('categoria')} className="admin-input w-56">
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex gap-3">
        <button type="button" onClick={buscar} className="admin-boton-oscuro">
          Buscar
        </button>
        <button type="button" onClick={reiniciar} className="admin-boton-oscuro">
          Reiniciar
        </button>
      </div>
    </div>
  )
}

function TabListaProductos() {
  const { productos } = useProductos()
  const { filtros, setFiltros, resultados, buscar, reiniciar } = useFiltroProductos(productos)

  return (
    <div>
      <FiltrosProductos filtros={filtros} setFiltros={setFiltros} buscar={buscar} reiniciar={reiniciar} />
      <p className="mt-4 text-sm font-bold text-admin-ink">Total : {resultados.length} Productos</p>
      <TablaProductos productos={resultados} />
    </div>
  )
}

function TabEliminarEditar() {
  const { productos, editarProducto, eliminarProducto } = useProductos()
  const { filtros, setFiltros, resultados, buscar, reiniciar } = useFiltroProductos(productos)

  const confirmarEliminar = (id) => {
    const producto = productos.find((p) => p.id === id)
    if (window.confirm(`¿Eliminar "${producto?.nombre}" del catálogo?`)) {
      eliminarProducto(id)
    }
  }

  return (
    <div>
      <FiltrosProductos filtros={filtros} setFiltros={setFiltros} buscar={buscar} reiniciar={reiniciar} />
      <p className="mt-4 text-sm font-bold text-admin-ink">Total : {resultados.length} Productos</p>
      <p className="mt-1 text-xs text-admin-muted">
        Tip: para poner un producto en oferta, editalo y cargá un "Precio anterior" mayor al
        precio actual — el descuento se calcula solo y se muestra en la tienda.
      </p>
      <TablaProductos
        productos={resultados}
        conAcciones
        onEditar={editarProducto}
        onEliminar={confirmarEliminar}
      />
    </div>
  )
}

function ZonaImagen({ imagen, onArchivo, cargando }) {
  const [arrastrando, setArrastrando] = useState(false)

  const manejarArchivos = (archivos) => {
    const archivo = archivos?.[0]
    if (archivo) onArchivo(archivo)
  }

  return (
    <div>
      <label className="text-sm text-admin-ink">Foto del producto</label>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setArrastrando(true)
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrando(false)
          manejarArchivos(e.dataTransfer.files)
        }}
        className={`relative mt-2 flex h-40 w-40 items-center justify-center overflow-hidden rounded-[10px] border border-dashed text-admin-muted transition ${
          arrastrando ? 'border-admin-primary bg-admin-primary/5' : 'border-admin-muted/40 bg-admin-bg/60'
        }`}
      >
        {imagen ? (
          <img src={imagen} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-xs">
            <IconoImagen tamano={28} />
            {cargando ? 'Cargando…' : 'Arrastrá una foto o hacé clic para elegirla'}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => manejarArchivos(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Subir foto del producto"
        />
      </div>
      {imagen && (
        <button
          type="button"
          onClick={() => onArchivo(null)}
          className="mt-2 text-xs text-admin-muted underline hover:text-admin-danger-text"
        >
          Quitar foto
        </button>
      )}
    </div>
  )
}

function TabAgregarProducto() {
  const { agregarProducto } = useProductos()
  const tallasVacias = Object.fromEntries(TALLAS.map((t) => [t, 0]))
  const vacio = {
    nombre: '',
    descripcion: '',
    precio: '',
    genero: GENEROS[0],
    categoria: CATEGORIAS_POR_GENERO[GENEROS[0]][0],
    imagen: '',
    tallas: tallasVacias,
  }
  const [datos, setDatos] = useState(vacio)
  const [confirmacion, setConfirmacion] = useState('')
  const [cargandoImagen, setCargandoImagen] = useState(false)
  const [errorImagen, setErrorImagen] = useState('')

  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }))

  const cambiarGenero = (e) => {
    const genero = e.target.value
    setDatos((d) => ({ ...d, genero, categoria: CATEGORIAS_POR_GENERO[genero][0] }))
  }

  const cambiarCantidadTalla = (talla) => (e) =>
    setDatos((d) => ({
      ...d,
      tallas: { ...d.tallas, [talla]: Math.max(0, Number(e.target.value) || 0) },
    }))

  const totalUnidades = Object.values(datos.tallas).reduce((s, n) => s + (n || 0), 0)

  const manejarArchivoImagen = async (archivo) => {
    setErrorImagen('')
    if (!archivo) {
      setDatos((d) => ({ ...d, imagen: '' }))
      return
    }
    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('Elegí un archivo de imagen (jpg, png, etc).')
      return
    }
    setCargandoImagen(true)
    try {
      const dataUrl = await leerImagenComoDataUrl(archivo)
      setDatos((d) => ({ ...d, imagen: dataUrl }))
    } catch {
      setErrorImagen('No se pudo procesar la imagen. Probá con otro archivo.')
    } finally {
      setCargandoImagen(false)
    }
  }

  const guardar = (e) => {
    e.preventDefault()
    agregarProducto({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      genero: datos.genero,
      categoria: datos.categoria,
      precio: Number(datos.precio) || 0,
      imagen: datos.imagen || undefined,
      tallas: datos.tallas,
    })
    setDatos(vacio)
    setConfirmacion(`"${datos.nombre}" se agregó al catálogo.`)
    setTimeout(() => setConfirmacion(''), 3000)
  }

  return (
    <form onSubmit={guardar}>
      <div className="admin-card px-8 py-7">
        <h2 className="text-lg font-bold text-admin-ink">Agregar Producto Nuevo</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="flex flex-col gap-1 border-b border-admin-bg pb-2 text-sm">
            Nombre del Producto
            <input
              required
              value={datos.nombre}
              onChange={cambiar('nombre')}
              className="bg-transparent py-1 text-sm focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 border-b border-admin-bg pb-2 text-sm">
            Descripción del Producto
            <input
              value={datos.descripcion}
              onChange={cambiar('descripcion')}
              className="bg-transparent py-1 text-sm focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Precio (₡)
            <input
              type="number"
              min={0}
              required
              value={datos.precio}
              onChange={cambiar('precio')}
              className="admin-input w-28"
            />
          </label>
        </div>
      </div>

      <div className="admin-card mt-6 px-8 py-7">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm">
                Género
                <select value={datos.genero} onChange={cambiarGenero} className="admin-input">
                  {GENEROS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Categoría
                <select value={datos.categoria} onChange={cambiar('categoria')} className="admin-input">
                  {CATEGORIAS_POR_GENERO[datos.genero].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm text-admin-ink">Inventario por talla</legend>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {TALLAS.map((t) => (
                  <label key={t} className="flex flex-col items-center gap-1 text-xs text-admin-muted">
                    {t}
                    <input
                      type="number"
                      min={0}
                      value={datos.tallas[t]}
                      onChange={cambiarCantidadTalla(t)}
                      className="admin-input w-full text-center"
                      aria-label={`Cantidad talla ${t}`}
                    />
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-admin-muted">
                Total: <span className="font-semibold text-admin-ink">{totalUnidades}</span> unidades
              </p>
            </fieldset>
          </div>

          <div>
            <ZonaImagen
              imagen={datos.imagen}
              onArchivo={manejarArchivoImagen}
              cargando={cargandoImagen}
            />
            {errorImagen && <p className="mt-2 text-xs text-admin-danger-text">{errorImagen}</p>}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          {confirmacion && <p className="text-sm text-admin-success-text">{confirmacion}</p>}
          <button type="submit" className="admin-boton-oscuro" disabled={cargandoImagen}>
            Guardar
          </button>
        </div>
      </div>
    </form>
  )
}

const TABS = [
  { id: 'lista', etiqueta: 'Lista de Productos' },
  { id: 'agregar', etiqueta: 'Agregar Productos' },
  { id: 'editar', etiqueta: 'Editar Productos' },
]

export default function ProductosAdmin() {
  const [parametros, setParametros] = useSearchParams()
  const tab = TABS.some((t) => t.id === parametros.get('tab')) ? parametros.get('tab') : 'lista'

  const irATab = (id) => setParametros({ tab: id })

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-ink">Productos</h1>

      <div className="mt-6 flex max-w-xl gap-1 rounded-[6px] bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => irATab(t.id)}
            className={`admin-tab ${tab === t.id ? 'admin-tab-activo' : 'admin-tab-inactivo'}`}
          >
            {t.etiqueta}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'lista' && <TabListaProductos />}
        {tab === 'agregar' && <TabAgregarProducto />}
        {tab === 'editar' && <TabEliminarEditar />}
      </div>
    </div>
  )
}
