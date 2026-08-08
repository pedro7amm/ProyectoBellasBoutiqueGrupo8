import { useMemo, useState } from 'react'
import { colones } from '../../contexto/CarritoContext.jsx'
import { usePedidos } from '../../contexto/PedidosContext.jsx'
import { ESTADOS_PEDIDO } from '../../datos/pedidos.js'
import { IconoBuscarAdmin, IconoPersona } from '../../componentes/admin/IconosAdmin.jsx'

const formatearFecha = (iso) => {
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}

function TarjetaPedido({ pedido }) {
  const { cambiarEstadoLinea } = usePedidos()

  return (
    <div className="admin-card border border-admin-muted/15 px-6 py-5">
      <div className="mb-4 flex items-center justify-between rounded-[5px] border border-admin-muted/30 px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-admin-ink">
          <IconoPersona tamano={16} />
          {pedido.cliente}
        </span>
        <span className="text-admin-muted">No. Pedido {pedido.numero}</span>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-admin-muted">
            <th className="pb-2 font-normal">Nombre del producto</th>
            <th className="pb-2 font-normal">Monto</th>
            <th className="pb-2 font-normal">Estado</th>
            <th className="pb-2 font-normal">Cantidad</th>
            <th className="pb-2 font-normal">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pedido.lineas.map((linea) => (
            <tr key={linea.id} className="border-t border-admin-bg">
              <td className="py-3 font-medium text-admin-ink">{linea.nombre}</td>
              <td className="py-3">{colones(linea.precio)}</td>
              <td className="py-3">
                <select
                  value={linea.estado}
                  onChange={(e) => cambiarEstadoLinea(pedido.numero, linea.id, e.target.value)}
                  className="rounded-[4px] border border-admin-muted/40 bg-white px-2 py-1 text-xs focus:border-admin-primary focus:outline-none"
                >
                  {ESTADOS_PEDIDO.map((estado) => (
                    <option key={estado}>{estado}</option>
                  ))}
                </select>
              </td>
              <td className="py-3">{linea.cantidad}</td>
              <td className="py-3">{formatearFecha(pedido.fecha)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function FacturacionAdmin() {
  const { pedidos } = usePedidos()
  const [busqueda, setBusqueda] = useState('')
  const [aplicada, setAplicada] = useState('')

  const resultados = useMemo(() => {
    if (!aplicada) return pedidos
    return pedidos.filter((p) => p.numero.toLowerCase().includes(aplicada.toLowerCase()))
  }, [pedidos, aplicada])

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-ink">Facturación</h1>

      <div className="admin-card mt-6 flex flex-wrap items-end gap-4 px-6 py-5">
        <label className="flex flex-col gap-1 text-sm">
          No. Pedido
          <div className="relative">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ingrese número de pedido"
              className="admin-input w-72 pr-9"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-admin-muted">
              <IconoBuscarAdmin tamano={16} />
            </span>
          </div>
        </label>
        <button type="button" onClick={() => setAplicada(busqueda)} className="admin-boton-oscuro">
          Buscar
        </button>
        <button
          type="button"
          onClick={() => {
            setBusqueda('')
            setAplicada('')
          }}
          className="admin-boton-claro"
        >
          Reiniciar
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {resultados.length === 0 ? (
          <div className="admin-card px-6 py-16 text-center text-sm text-admin-muted">
            No hay pedidos con ese número.
          </div>
        ) : (
          resultados.map((pedido) => <TarjetaPedido key={pedido.numero} pedido={pedido} />)
        )}
      </div>
    </div>
  )
}
