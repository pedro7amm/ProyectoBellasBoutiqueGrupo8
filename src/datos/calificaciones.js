// Calcula una calificación representativa (no una calificación real de reseñas)
// según cuánto se vende cada producto en relación con el más vendido del catálogo.
// Se usa tanto en el catálogo del cliente como en el panel de administración/vendedores,
// para que el "Rating" que se ve en ambos lados sea siempre el mismo número.

const CALIFICACION_BASE = 3.8
const CALIFICACION_MAXIMA = 5
const CALIFICACION_MINIMA_CON_VENTAS = 4

/**
 * @param {Array} productos - lista de productos (necesita [.id])
 * @param {Array} pedidos - lista de pedidos (necesita [.lineas[].id, .lineas[].cantidad])
 * @returns {Map<number, { calificacion: number|null, unidadesVendidas: number }>}
 */
export function calcularCalificaciones(productos, pedidos) {
  const unidadesPorProducto = new Map()

  pedidos.forEach((pedido) => {
    pedido.lineas.forEach((linea) => {
      unidadesPorProducto.set(linea.id, (unidadesPorProducto.get(linea.id) || 0) + linea.cantidad)
    })
  })

  const maxVendidas = Math.max(0, ...unidadesPorProducto.values())
  const resultado = new Map()

  productos.forEach((producto) => {
    const unidadesVendidas = unidadesPorProducto.get(producto.id) || 0

    if (unidadesVendidas === 0 || maxVendidas === 0) {
      resultado.set(producto.id, { calificacion: null, unidadesVendidas: 0 })
      return
    }

    const proporcion = unidadesVendidas / maxVendidas
    const calificacion = Math.min(
      CALIFICACION_MAXIMA,
      Math.max(
        CALIFICACION_MINIMA_CON_VENTAS,
        Math.round((CALIFICACION_BASE + proporcion * 1.2) * 10) / 10,
      ),
    )

    resultado.set(producto.id, { calificacion, unidadesVendidas })
  })

  return resultado
}
