import { useMemo, useState } from 'react'
import { colones } from '../../contexto/CarritoContext.jsx'
import { usePedidos } from '../../contexto/PedidosContext.jsx'
import { useProductos } from '../../contexto/ProductosContext.jsx'
import { useBitacora } from '../../contexto/BitacoraContext.jsx'
import { CATEGORIAS } from '../../datos/productos.js'

const hoyISO = () => new Date().toISOString().slice(0, 10)
const UMBRAL_STOCK_BAJO = 5

function calcularEstadisticas(pedidos, productos, categoria) {
  const categoriaPorId = new Map(productos.map((p) => [p.id, p.categoria]))
  const porProducto = new Map()

  let unidades = 0
  let ingresos = 0
  let facturas = 0

  pedidos.forEach((pedido) => {
    let facturaCuenta = false
    pedido.lineas.forEach((linea) => {
      const cat = categoriaPorId.get(linea.id)
      if (categoria && cat !== categoria) return
      facturaCuenta = true
      unidades += linea.cantidad
      ingresos += linea.precio * linea.cantidad

      const acumulado = porProducto.get(linea.nombre) || { unidades: 0, ingresos: 0, categoria: cat }
      acumulado.unidades += linea.cantidad
      acumulado.ingresos += linea.precio * linea.cantidad
      porProducto.set(linea.nombre, acumulado)
    })
    if (facturaCuenta) facturas += 1
  })

  return {
    unidades,
    ingresos,
    facturaPromedio: facturas ? ingresos / facturas : 0,
    filas: [...porProducto.entries()].map(([nombre, datos]) => ({ nombre, ...datos })),
  }
}

function TarjetaEstadistica({ etiqueta, valor }) {
  return (
    <div className="rounded-[10px] bg-admin-bg/70 px-6 py-5 print:border print:border-admin-bg print:bg-white">
      <p className="text-xs text-admin-muted">{etiqueta}</p>
      <p className="mt-2 text-2xl font-bold text-admin-ink">{valor}</p>
    </div>
  )
}

function TablaVentas({ filas }) {
  if (filas.length === 0) {
    return <p className="mt-8 text-sm text-admin-muted">No hay ventas para este filtro.</p>
  }
  return (
    <table className="mt-8 w-full text-left text-sm">
      <thead>
        <tr className="text-admin-muted">
          <th className="pb-2 font-normal">Producto</th>
          <th className="pb-2 font-normal">Categoría</th>
          <th className="pb-2 font-normal">Unidades vendidas</th>
          <th className="pb-2 font-normal">Ingresos</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((fila) => (
          <tr key={fila.nombre} className="border-t border-admin-bg">
            <td className="py-3 text-admin-ink">{fila.nombre}</td>
            <td className="py-3 text-admin-ink">{fila.categoria}</td>
            <td className="py-3 text-admin-ink">{fila.unidades}</td>
            <td className="py-3 text-admin-ink">{colones(fila.ingresos)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TablaStockBajo({ productos }) {
  const bajos = productos
    .filter((p) => p.stock <= UMBRAL_STOCK_BAJO)
    .sort((a, b) => a.stock - b.stock)

  return (
    <div className="admin-card mt-6 px-8 py-7 print:break-inside-avoid print:border print:border-admin-bg print:shadow-none">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-admin-ink">Stock bajo</h2>
        <span className="text-xs text-admin-muted">{UMBRAL_STOCK_BAJO} unidades o menos</span>
      </div>

      {bajos.length === 0 ? (
        <p className="mt-4 text-sm text-admin-muted">
          Ningún producto está por debajo del umbral. Todo en orden.
        </p>
      ) : (
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="text-admin-muted">
              <th className="pb-2 font-normal">Producto</th>
              <th className="pb-2 font-normal">Categoría</th>
              <th className="pb-2 font-normal">Stock restante</th>
            </tr>
          </thead>
          <tbody>
            {bajos.map((p) => (
              <tr key={p.id} className="border-t border-admin-bg">
                <td className="py-3 text-admin-ink">{p.nombre}</td>
                <td className="py-3 text-admin-ink">{p.categoria}</td>
                <td
                  className={`py-3 font-semibold ${p.stock === 0 ? 'text-admin-danger-text' : 'text-admin-ink'}`}
                >
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const ESTILOS_ACCION = {
  alta: 'bg-admin-success-bg text-admin-success-text',
  baja: 'bg-admin-danger-bg text-admin-danger-text',
  modificacion: 'bg-admin-bg text-admin-ink',
  compra: 'bg-admin-primary/10 text-admin-primary',
}

function Bitacora() {
  const { eventos } = useBitacora()
  const [modulo, setModulo] = useState('')
  const modulos = [...new Set(eventos.map((e) => e.modulo))]

  const filtrados = modulo ? eventos.filter((e) => e.modulo === modulo) : eventos

  return (
    <div className="admin-card mt-6 px-8 py-7">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-admin-ink">Bitácora de actividades</h2>
        <select
          value={modulo}
          onChange={(e) => setModulo(e.target.value)}
          className="admin-input w-48"
        >
          <option value="">Todos los módulos</option>
          {modulos.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <p className="mt-6 text-sm text-admin-muted">Todavía no hay actividad registrada.</p>
      ) : (
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="text-admin-muted">
              <th className="pb-2 font-normal">Fecha y hora</th>
              <th className="pb-2 font-normal">Usuario</th>
              <th className="pb-2 font-normal">Módulo</th>
              <th className="pb-2 font-normal">Acción</th>
              <th className="pb-2 font-normal">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.slice(0, 200).map((e) => (
              <tr key={e.id} className="border-t border-admin-bg align-top">
                <td className="whitespace-nowrap py-3 text-admin-muted">
                  {new Date(e.fecha).toLocaleString('es-CR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="py-3 text-admin-ink">{e.actor}</td>
                <td className="py-3 text-admin-ink">{e.modulo}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      ESTILOS_ACCION[e.accion] || 'bg-admin-bg text-admin-ink'
                    }`}
                  >
                    {e.accion}
                  </span>
                </td>
                <td className="py-3 text-admin-ink">{e.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default function ReportesAdmin() {
  const { pedidos } = usePedidos()
  const { productos } = useProductos()
  const [vista, setVista] = useState('ventas')
  const [modo, setModo] = useState('diario')
  const [fecha, setFecha] = useState(hoyISO())
  const [mes, setMes] = useState(hoyISO().slice(0, 7))
  const [categoria, setCategoria] = useState('')

  const pedidosFiltrados = useMemo(() => {
    if (modo === 'diario') return pedidos.filter((p) => p.fecha === fecha)
    return pedidos.filter((p) => p.fecha.startsWith(mes))
  }, [pedidos, modo, fecha, mes])

  const estadisticas = useMemo(
    () => calcularEstadisticas(pedidosFiltrados, productos, categoria),
    [pedidosFiltrados, productos, categoria],
  )

  return (
    <div>
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-admin-ink">Reportes</h1>
        <div className="flex gap-1 rounded-[6px] bg-white p-1">
          {[
            { id: 'ventas', etiqueta: 'Ventas' },
            { id: 'bitacora', etiqueta: 'Bitácora' },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVista(v.id)}
              className={`admin-tab ${vista === v.id ? 'admin-tab-activo' : 'admin-tab-inactivo'}`}
            >
              {v.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {vista === 'bitacora' ? (
        <Bitacora />
      ) : (
        <>
          <div className="admin-card mt-6 px-8 py-7 print:border print:border-admin-bg print:shadow-none">
            {/* Encabezado de marca: solo aparece al imprimir/exportar */}
            <div className="hidden items-center justify-between border-b border-admin-bg pb-6 print:flex">
              <div className="flex items-center gap-3">
                <img src="/img/logo.png" alt="Bella Boutique" className="h-9 w-auto" />
                <div>
                  <p className="text-sm font-bold text-admin-ink">Bella Boutique</p>
                  <p className="text-xs text-admin-muted">San José, Costa Rica</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-admin-ink">Reporte de ventas</p>
                <p className="text-xs text-admin-muted">Generado el {hoyISO()}</p>
              </div>
            </div>

            <div className="flex gap-8 border-b border-admin-bg text-sm print:hidden">
              {[
                { id: 'diario', etiqueta: 'Reporte diario' },
                { id: 'mensual', etiqueta: 'Reporte mensual' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setModo(t.id)}
                  className={`-mb-px border-b-2 pb-3 transition ${
                    modo === t.id
                      ? 'border-admin-ink font-semibold text-admin-ink'
                      : 'border-transparent text-admin-muted hover:text-admin-ink'
                  }`}
                >
                  {t.etiqueta}
                </button>
              ))}
            </div>

            <p className="mt-4 hidden text-sm font-bold text-admin-ink print:block">
              {modo === 'diario' ? `Reporte diario — ${fecha}` : `Reporte mensual — ${mes}`}
              {categoria ? ` · ${categoria}` : ''}
            </p>

            <div className="mt-5 flex flex-wrap items-end gap-4 print:hidden">
              {modo === 'diario' ? (
                <label className="flex flex-col gap-1 text-xs text-admin-muted">
                  Fecha
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="admin-input"
                  />
                </label>
              ) : (
                <label className="flex flex-col gap-1 text-xs text-admin-muted">
                  Mes
                  <input
                    type="month"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="admin-input"
                  />
                </label>
              )}

              <label className="flex flex-col gap-1 text-xs text-admin-muted">
                Categoría
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="admin-input w-48"
                >
                  <option value="">Todas las categorías</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => window.print()}
                className="admin-boton-claro ml-auto"
                title="Usa el diálogo de impresión del navegador para guardar como PDF"
              >
                Exportar PDF
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <TarjetaEstadistica etiqueta="Productos vendidos" valor={estadisticas.unidades} />
              <TarjetaEstadistica
                etiqueta="Ingresos totales"
                valor={colones(estadisticas.ingresos)}
              />
              <TarjetaEstadistica
                etiqueta="Factura promedio"
                valor={colones(estadisticas.facturaPromedio)}
              />
            </div>

            <TablaVentas filas={estadisticas.filas} />
          </div>

          <TablaStockBajo productos={productos} />
        </>
      )}
    </div>
  )
}
