import { Link, Navigate, useParams } from 'react-router-dom'
import { colones, IVA } from '../contexto/CarritoContext.jsx'
import { usePedidos } from '../contexto/PedidosContext.jsx'
import { useClientes } from '../contexto/ClientesContext.jsx'

export default function FacturaDescarga() {
  const { numero } = useParams()
  const { pedidos } = usePedidos()
  const { clienteActual } = useClientes()

  const pedido = pedidos.find((p) => p.numero === numero)

  // Solo el cliente dueño del pedido puede ver su factura.
  if (!pedido || !clienteActual || pedido.clienteId !== clienteActual.id) {
    return <Navigate to="/" replace />
  }

  const subtotal = pedido.lineas.reduce((s, l) => s + l.precio * l.cantidad, 0)
  const impuesto = subtotal * IVA
  const envio = pedido.envio?.costo || 0
  const total = subtotal + impuesto + envio

  return (
    <div className="min-h-screen bg-humo py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-2xl bg-white px-10 py-12 shadow-sm print:shadow-none">
        <div className="flex items-start justify-between border-b border-borde pb-8">
          <div>
            <img src="/img/logo.png" alt="Bella Boutique" className="h-10 w-auto" />
            <p className="mt-3 text-xs text-gris">
              Bella Boutique
              <br />
              San José, Costa Rica
              <br />
              hola@bellaboutique.com
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-extrabold tracking-wide">FACTURA</h1>
            <p className="mt-1 text-sm text-gris">N.º {pedido.numero}</p>
            <p className="text-sm text-gris">{pedido.fecha}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gris">FACTURADO A</h2>
            <p className="mt-2 font-semibold">{pedido.cliente}</p>
            <p className="text-gris">{pedido.direccion}</p>
            <p className="text-gris">{pedido.provincia}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-gris">ENVÍO Y PAGO</h2>
            <p className="mt-2 text-gris">{pedido.envio?.nombre || '—'}</p>
            <p className="text-gris">{pedido.pago}</p>
          </div>
        </div>

        <table className="mt-10 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-tinta text-left text-xs tracking-wide text-gris">
              <th className="pb-2 font-normal">Producto</th>
              <th className="pb-2 font-normal">Talla</th>
              <th className="pb-2 text-center font-normal">Cant.</th>
              <th className="pb-2 text-right font-normal">Precio</th>
              <th className="pb-2 text-right font-normal">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.lineas.map((linea, i) => (
              <tr key={i} className="border-b border-borde">
                <td className="py-3">{linea.nombre}</td>
                <td className="py-3 text-gris">{linea.talla || '—'}</td>
                <td className="py-3 text-center">{linea.cantidad}</td>
                <td className="py-3 text-right">{colones(linea.precio)}</td>
                <td className="py-3 text-right">{colones(linea.precio * linea.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-6 w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-gris">
            <span>Subtotal</span>
            <span>{colones(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gris">
            <span>IVA 13%</span>
            <span>{colones(impuesto)}</span>
          </div>
          <div className="flex justify-between text-gris">
            <span>Envío</span>
            <span>{envio === 0 ? 'Gratis' : colones(envio)}</span>
          </div>
          <div className="flex justify-between border-t border-tinta pt-2 text-base font-bold">
            <span>Total</span>
            <span>{colones(total)}</span>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-gris">
          Gracias por comprar en Bella Boutique — este comprobante es válido como factura de la
          compra.
        </p>

        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <button type="button" onClick={() => window.print()} className="boton-solido">
            Descargar / Imprimir
          </button>
          <Link to="/mis-pedidos" className="boton-linea">
            Volver a mis pedidos
          </Link>
        </div>
      </div>
    </div>
  )
}
