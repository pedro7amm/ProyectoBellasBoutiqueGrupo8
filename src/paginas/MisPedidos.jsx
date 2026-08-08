import { Link, Navigate } from 'react-router-dom'
import { colones } from '../contexto/CarritoContext.jsx'
import { usePedidos } from '../contexto/PedidosContext.jsx'
import { useClientes } from '../contexto/ClientesContext.jsx'
import { IconoCaja } from '../componentes/Iconos.jsx'

const estilosEstado = {
  Enviado: 'bg-niebla text-tinta',
  Preparando: 'bg-niebla text-tinta',
  Entregado: 'bg-tinta text-white',
  Cancelado: 'bg-red-50 text-red-700',
}

export default function MisPedidos() {
  const { clienteActual } = useClientes()
  const { pedidos } = usePedidos()

  if (!clienteActual) return <Navigate to="/" replace />

  const misPedidos = pedidos.filter((p) => p.clienteId === clienteActual.id)

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="titulo-seccion">Mis pedidos</h1>

      {misPedidos.length === 0 ? (
        <div className="mt-10 border border-borde bg-niebla px-6 py-16 text-center">
          <p className="text-sm text-gris">Todavía no tenés pedidos hechos con esta cuenta.</p>
          <Link to="/catalogo" className="boton-solido mt-6 inline-block">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {misPedidos.map((pedido) => {
            const monto = pedido.lineas.reduce((s, l) => s + l.precio * l.cantidad, 0)
            const estados = [...new Set(pedido.lineas.map((l) => l.estado))]
            return (
              <li key={pedido.numero} className="border border-borde p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold">
                      <IconoCaja tamano={16} />
                      Pedido #{pedido.numero}
                    </p>
                    <p className="mt-1 text-xs text-gris">{pedido.fecha}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {estados.map((e) => (
                      <span
                        key={e}
                        className={`px-3 py-1 text-[11px] font-semibold ${estilosEstado[e] || 'bg-niebla text-tinta'}`}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-borde border-t border-borde">
                  {pedido.lineas.map((linea, i) => (
                    <li key={i} className="flex justify-between py-2 text-sm">
                      <span>
                        {linea.cantidad} × {linea.nombre}
                      </span>
                      <span className="text-gris">{colones(linea.precio * linea.cantidad)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-borde pt-3 text-sm font-bold">
                  <span>Total</span>
                  <span className="flex items-center gap-4">
                    {colones(monto)}
                    {pedido.clienteId != null && (
                      <Link
                        to={`/factura/${pedido.numero}`}
                        className="text-xs font-normal text-tinta underline"
                      >
                        Ver factura
                      </Link>
                    )}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
