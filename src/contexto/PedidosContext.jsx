import { createContext, useContext, useEffect, useState } from 'react'
import { pedidosSemilla } from '../datos/pedidos.js'
import { useBitacora } from './BitacoraContext.jsx'

const PedidosContext = createContext(null)

const CLAVE = 'bella-boutique-pedidos'

const leer = () => {
  try {
    const guardado = sessionStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : pedidosSemilla
  } catch {
    return pedidosSemilla
  }
}

const guardar = (pedidos) => {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(pedidos))
  } catch {
    /* sessionStorage lleno o bloqueado: los pedidos siguen funcionando en memoria */
  }
}

export function ProveedorPedidos({ children }) {
  const [pedidos, setPedidos] = useState(leer)
  const { registrarEvento } = useBitacora()

  useEffect(() => guardar(pedidos), [pedidos])

  /** Se llama desde el checkout del cliente al confirmar el pago. */
  const registrarPedido = ({
    numero,
    cliente,
    clienteId,
    direccion,
    provincia,
    envio,
    pago,
    lineas,
  }) => {
    setPedidos((actuales) => [
      {
        numero,
        cliente,
        clienteId: clienteId ?? null,
        direccion: direccion ?? '',
        provincia: provincia ?? '',
        envio: envio ?? null,
        pago: pago ?? '',
        fecha: new Date().toISOString().slice(0, 10),
        lineas: lineas.map((l) => ({
          id: l.id,
          nombre: l.nombre,
          precio: l.precio,
          cantidad: l.cantidad,
          talla: l.talla ?? null,
          estado: 'Enviado',
        })),
      },
      ...actuales,
    ])
    const monto = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0)
    registrarEvento({
      actor: cliente ? `Cliente: ${cliente}` : 'Cliente',
      accion: 'compra',
      modulo: 'Pedidos',
      descripcion: `Pedido #${numero} por un total aproximado de ₡${Math.round(monto).toLocaleString('es-CR')}.`,
    })
  }

  const cambiarEstadoLinea = (numeroPedido, idProducto, nuevoEstado) => {
    setPedidos((actuales) =>
      actuales.map((p) =>
        p.numero !== numeroPedido
          ? p
          : {
              ...p,
              lineas: p.lineas.map((l) =>
                l.id === idProducto ? { ...l, estado: nuevoEstado } : l,
              ),
            },
      ),
    )
  }

  const valor = { pedidos, registrarPedido, cambiarEstadoLinea }

  return <PedidosContext.Provider value={valor}>{children}</PedidosContext.Provider>
}

export function usePedidos() {
  const contexto = useContext(PedidosContext)
  if (!contexto) throw new Error('usePedidos debe usarse dentro de <ProveedorPedidos>')
  return contexto
}
