import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CarritoContext = createContext(null)

const CLAVE = 'bella-boutique-carrito'
export const IVA = 0.13

/** Formatea un monto en colones: 32500 -> ₡ 32.500 */
export const colones = (monto) =>
  '₡ ' + new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(Math.round(monto))

const leerAlmacenamiento = () => {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

export function ProveedorCarrito({ children }) {
  const [lineas, setLineas] = useState(leerAlmacenamiento)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas))
    } catch {
      /* almacenamiento lleno o bloqueado: el carrito sigue funcionando en memoria */
    }
  }, [lineas])

  const agregar = (producto, talla, cantidad = 1) => {
    setLineas((actuales) => {
      const existente = actuales.find((l) => l.id === producto.id && l.talla === talla)
      if (existente) {
        return actuales.map((l) =>
          l === existente ? { ...l, cantidad: Math.min(l.cantidad + cantidad, producto.stock) } : l,
        )
      }
      return [
        ...actuales,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          stock: producto.stock,
          talla,
          cantidad,
        },
      ]
    })
  }

  const cambiarCantidad = (id, talla, delta) => {
    setLineas((actuales) =>
      actuales
        .map((l) =>
          l.id === id && l.talla === talla
            ? { ...l, cantidad: Math.min(Math.max(l.cantidad + delta, 0), l.stock) }
            : l,
        )
        .filter((l) => l.cantidad > 0),
    )
  }

  const quitar = (id, talla) =>
    setLineas((actuales) => actuales.filter((l) => !(l.id === id && l.talla === talla)))

  const vaciar = () => setLineas([])

  const totales = useMemo(() => {
    const subtotal = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0)
    const impuesto = subtotal * IVA
    return {
      unidades: lineas.reduce((suma, l) => suma + l.cantidad, 0),
      subtotal,
      impuesto,
      total: subtotal + impuesto,
    }
  }, [lineas])

  const valor = { lineas, agregar, cambiarCantidad, quitar, vaciar, ...totales }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  return contexto
}
