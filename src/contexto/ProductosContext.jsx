import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { productos as productosSemilla, stockTotal } from '../datos/productos.js'
import { calcularCalificaciones } from '../datos/calificaciones.js'
import { usePedidos } from './PedidosContext.jsx'
import { useBitacora } from './BitacoraContext.jsx'
import { useSesion } from './SesionContext.jsx'

const ProductosContext = createContext(null)

const CLAVE = 'bella-boutique-productos'

const leer = () => {
  try {
    const guardado = sessionStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : productosSemilla
  } catch {
    return productosSemilla
  }
}

const guardar = (productos) => {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(productos))
  } catch {
    /* sessionStorage lleno o bloqueado: el catálogo sigue funcionando en memoria */
  }
}

export function ProveedorProductos({ children }) {
  const [productos, setProductos] = useState(leer)
  const { pedidos } = usePedidos()
  const { registrarEvento } = useBitacora()
  const { usuarioActual } = useSesion()

  const actor = usuarioActual ? `${usuarioActual.nombre} (${usuarioActual.rol})` : 'Desconocido'

  useEffect(() => guardar(productos), [productos])

  /** Rating representativo según cuánto se vende cada producto (ver datos/calificaciones.js). */
  const productosConCalificacion = useMemo(() => {
    const calculadas = calcularCalificaciones(productos, pedidos)
    return productos.map((p) => {
      const info = calculadas.get(p.id)
      return {
        ...p,
        // El inventario total siempre se calcula a partir del desglose por talla,
        // así nunca queda desincronizado con lo que se ve en Productos.
        stock: stockTotal(p.tallas),
        calificacion: info?.calificacion ?? p.calificacion ?? null,
        unidadesVendidas: info?.unidadesVendidas ?? 0,
      }
    })
  }, [productos, pedidos])

  const siguienteId = (lista) => Math.max(0, ...lista.map((p) => p.id)) + 1

  const agregarProducto = (datos) => {
    setProductos((actuales) => [
      ...actuales,
      {
        precioAnterior: null,
        calificacion: 0,
        etiqueta: null,
        imagen: datos.imagen || '/img/productos/camisa.jpg',
        tallas: datos.tallas && Object.keys(datos.tallas).length ? datos.tallas : { S: 0, M: 0, L: 0 },
        proveedor: datos.proveedor || 'BELLAS',
        ...datos,
        id: siguienteId(actuales),
      },
    ])
    registrarEvento({
      actor,
      accion: 'alta',
      modulo: 'Productos',
      descripcion: `Agregó el producto "${datos.nombre}".`,
    })
  }

  const editarProducto = (id, cambios) => {
    setProductos((actuales) => actuales.map((p) => (p.id === id ? { ...p, ...cambios } : p)))
    const nombre = productos.find((p) => p.id === id)?.nombre || `#${id}`
    registrarEvento({
      actor,
      accion: 'modificacion',
      modulo: 'Productos',
      descripcion: `Editó el producto "${nombre}".`,
    })
  }

  const eliminarProducto = (id) => {
    const nombre = productos.find((p) => p.id === id)?.nombre || `#${id}`
    setProductos((actuales) => actuales.filter((p) => p.id !== id))
    registrarEvento({
      actor,
      accion: 'baja',
      modulo: 'Productos',
      descripcion: `Eliminó el producto "${nombre}".`,
    })
  }

  /** Descuenta el inventario de UNA talla cuando se confirma una compra en el checkout. */
  const descontarStock = (id, talla, cantidad) => {
    setProductos((actuales) =>
      actuales.map((p) => {
        if (p.id !== id) return p
        const actual = p.tallas?.[talla] || 0
        return { ...p, tallas: { ...p.tallas, [talla]: Math.max(0, actual - cantidad) } }
      }),
    )
  }

  const reiniciarCatalogo = () => setProductos(productosSemilla)

  const valor = {
    productos: productosConCalificacion,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    descontarStock,
    reiniciarCatalogo,
  }

  return <ProductosContext.Provider value={valor}>{children}</ProductosContext.Provider>
}

export function useProductos() {
  const contexto = useContext(ProductosContext)
  if (!contexto) throw new Error('useProductos debe usarse dentro de <ProveedorProductos>')
  return contexto
}
