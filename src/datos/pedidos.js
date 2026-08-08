// Pedidos de ejemplo para que Facturación y Reportes tengan datos al abrir el panel
// por primera vez. Los pedidos reales que hacen los clientes en /facturacion se agregan
// automáticamente a esta misma lista (ver PedidosContext).

export const ESTADOS_PEDIDO = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']

export const pedidosSemilla = [
  {
    numero: '2201223FJA0Q',
    cliente: 'Saray Chaves',
    fecha: '2026-08-06',
    lineas: [
      { id: 3, nombre: 'Vestido midi', precio: 15000, cantidad: 1, estado: 'Enviado' },
      { id: 1, nombre: 'Camisa negra', precio: 13500, cantidad: 1, estado: 'Enviado' },
    ],
  },
  {
    numero: '2197139TYQPWO',
    cliente: 'Alan Ramírez',
    fecha: '2026-08-05',
    lineas: [
      { id: 4, nombre: 'Tenis old school', precio: 16000, cantidad: 2, estado: 'Enviado' },
      { id: 5, nombre: 'Top corto', precio: 8000, cantidad: 1, estado: 'Enviado' },
    ],
  },
]
