import { useState } from 'react'
import { colones } from '../../contexto/CarritoContext.jsx'
import { CATEGORIAS, TALLAS } from '../../datos/productos.js'
import EstadoBadge from './EstadoBadge.jsx'
import { IconoEstrellaAdmin, IconoLapiz, IconoTacho } from './IconosAdmin.jsx'

/** Redondea el % de descuento a partir del precio anterior vs el precio actual. */
function calcularDescuento(precio, precioAnterior) {
  if (!precioAnterior || precioAnterior <= precio) return null
  return Math.round((1 - precio / precioAnterior) * 100)
}

function FilaEdicion({ producto, onGuardar, onCancelar }) {
  const [borrador, setBorrador] = useState({
    nombre: producto.nombre,
    precio: producto.precio,
    precioAnterior: producto.precioAnterior || '',
    categoria: producto.categoria,
    tallas: { ...(producto.tallas || {}) },
  })

  const cambiar = (campo) => (e) =>
    setBorrador((actual) => ({
      ...actual,
      [campo]:
        campo === 'precio' || campo === 'precioAnterior'
          ? e.target.value === ''
            ? ''
            : Number(e.target.value)
          : e.target.value,
    }))

  const cambiarTalla = (talla) => (e) =>
    setBorrador((actual) => ({
      ...actual,
      tallas: { ...actual.tallas, [talla]: Math.max(0, Number(e.target.value) || 0) },
    }))

  const descuento = calcularDescuento(borrador.precio, borrador.precioAnterior)

  const guardar = () => {
    const precioAnterior = borrador.precioAnterior === '' ? null : borrador.precioAnterior
    const enOferta = calcularDescuento(borrador.precio, precioAnterior)
    onGuardar({
      ...borrador,
      precioAnterior: enOferta ? precioAnterior : null,
      etiqueta: enOferta ? `Descuento ${enOferta}%` : null,
    })
  }

  return (
    <tr className="border-b border-admin-bg bg-admin-bg/40">
      <td className="py-3 pl-6 pr-3">
        <input className="admin-input" value={borrador.nombre} onChange={cambiar('nombre')} />
      </td>
      <td className="px-3 py-3">
        <select
          className="admin-input"
          value={borrador.categoria}
          onChange={cambiar('categoria')}
        >
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1">
          {TALLAS.map((t) => (
            <label key={t} className="flex items-center gap-2 text-xs text-admin-muted">
              <span className="w-6">{t}</span>
              <input
                type="number"
                min={0}
                value={borrador.tallas[t] ?? 0}
                onChange={cambiarTalla(t)}
                className="admin-input w-16"
                aria-label={`Inventario talla ${t}`}
              />
            </label>
          ))}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            min={0}
            className="admin-input w-24"
            value={borrador.precio}
            onChange={cambiar('precio')}
            aria-label="Precio actual"
          />
          <input
            type="number"
            min={0}
            className="admin-input w-24"
            placeholder="Precio anterior (oferta)"
            value={borrador.precioAnterior}
            onChange={cambiar('precioAnterior')}
            aria-label="Precio anterior, para marcarlo en oferta"
          />
          {descuento != null && (
            <span className="text-[11px] font-semibold text-admin-success-text">
              −{descuento}% de descuento
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-admin-muted">
        {Object.values(borrador.tallas).reduce((s, n) => s + (n || 0), 0)}
      </td>
      <td className="px-3 py-3 text-sm text-admin-muted">—</td>
      <td className="px-3 py-3 text-sm text-admin-muted">—</td>
      <td className="py-3 pl-3 pr-6">
        <div className="flex gap-4 text-sm font-medium">
          <button type="button" className="text-admin-primary" onClick={guardar}>
            Guardar
          </button>
          <button type="button" className="text-admin-muted" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function TablaProductos({ productos, conAcciones = false, onEditar, onEliminar }) {
  const [editandoId, setEditandoId] = useState(null)

  if (productos.length === 0) {
    return (
      <div className="admin-card mt-4 px-6 py-16 text-center text-sm text-admin-muted">
        No hay productos que coincidan con la búsqueda.
      </div>
    )
  }

  return (
    <div className="admin-card mt-4 overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="bg-admin-bg/60 text-sm text-admin-ink">
            <th className="py-4 pl-6 pr-3 font-normal">Nombre del Producto</th>
            <th className="px-3 py-4 font-normal">Categoría</th>
            <th className="px-3 py-4 font-normal">Tallas</th>
            <th className="px-3 py-4 font-normal">Precio</th>
            <th className="px-3 py-4 font-normal">Inventario</th>
            <th className="px-3 py-4 font-normal">Rating</th>
            <th className="px-3 py-4 font-normal">Estado</th>
            {conAcciones && <th className="py-4 pl-3 pr-6 font-normal">Acción</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) =>
            editandoId === producto.id ? (
              <FilaEdicion
                key={producto.id}
                producto={producto}
                onCancelar={() => setEditandoId(null)}
                onGuardar={(cambios) => {
                  onEditar(producto.id, cambios)
                  setEditandoId(null)
                }}
              />
            ) : (
              <tr key={producto.id} className="border-b border-admin-bg last:border-0">
                <td className="flex items-center gap-3 py-4 pl-6 pr-3">
                  <img
                    src={producto.imagen}
                    alt=""
                    className="h-11 w-11 rounded-lg bg-admin-bg object-contain"
                  />
                  <span className="text-sm font-medium text-admin-ink">{producto.nombre}</span>
                </td>
                <td className="px-3 py-4 text-sm text-admin-ink">{producto.categoria}</td>
                <td className="px-3 py-4 text-sm text-admin-ink">
                  {producto.tallas && Object.keys(producto.tallas).length ? (
                    <span
                      title={TALLAS.map((t) => `${t}: ${producto.tallas[t] ?? 0}`).join(' · ')}
                      className="whitespace-nowrap"
                    >
                      {TALLAS.filter((t) => t in producto.tallas)
                        .map((t) => `${t} ${producto.tallas[t] ?? 0}`)
                        .join(' · ')}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-admin-ink">
                  <div className="flex flex-col">
                    <span className={producto.precioAnterior ? 'text-admin-success-text' : ''}>
                      {colones(producto.precio)}
                    </span>
                    {producto.precioAnterior && (
                      <span className="text-xs text-admin-muted line-through">
                        {colones(producto.precioAnterior)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-admin-ink">{producto.stock}</td>
                <td className="px-3 py-4">
                  <span className="flex items-center gap-1 text-sm text-admin-ink">
                    <span className="text-estrella">
                      <IconoEstrellaAdmin tamano={14} />
                    </span>
                    {producto.calificacion != null ? producto.calificacion : '—'}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <EstadoBadge
                    estado={producto.stock > 0 ? 'Disponible' : 'Fuera de Stock'}
                    tono="positivo"
                  />
                </td>
                {conAcciones && (
                  <td className="py-4 pl-3 pr-6">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setEditandoId(producto.id)}
                        className="flex items-center gap-1 text-sm font-medium text-admin-ink transition hover:text-admin-primary"
                      >
                        <IconoLapiz tamano={15} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onEliminar(producto.id)}
                        className="flex items-center gap-1 text-sm font-medium text-admin-ink transition hover:text-admin-danger-text"
                      >
                        <IconoTacho tamano={15} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

