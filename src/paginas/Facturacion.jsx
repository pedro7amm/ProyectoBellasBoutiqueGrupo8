import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { colones, useCarrito } from '../contexto/CarritoContext.jsx'
import { LineasCarrito, ResumenTotales } from './Carrito.jsx'
import {
  IconoCaja,
  IconoCheck,
  IconoTarjeta,
  IconoUbicacion,
  IconoUsuario,
} from '../componentes/Iconos.jsx'

const PROVINCIAS = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
]

const ENVIOS = [
  { id: 'tienda', nombre: 'Retiro en tienda', costo: 0 },
  { id: 'gam', nombre: 'Entrega en GAM (1-2 días)', costo: 2500 },
  { id: 'nacional', nombre: 'Correos de Costa Rica (3-5 días)', costo: 3500 },
]

const PAGOS = ['Tarjeta Visa', 'Tarjeta MasterCard', 'SINPE Móvil', 'Pago contra entrega']

const numeroOrden = () =>
  '2201' + Math.random().toString(36).slice(2, 8).toUpperCase()

const Paso = ({ numero, activo }) => (
  <span
    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
      activo ? 'border-tinta font-semibold' : 'border-borde text-gris'
    }`}
  >
    {numero}
  </span>
)

export default function Facturacion() {
  const { lineas, total, vaciar } = useCarrito()
  const navegar = useNavigate()

  const [paso, setPaso] = useState(1)
  const [orden, setOrden] = useState(null)
  const [datos, setDatos] = useState({
    nombre: '',
    provincia: PROVINCIAS[0],
    direccion: '',
    envio: ENVIOS[0].id,
    pago: PAGOS[0],
  })

  if (lineas.length === 0 && !orden) return <Navigate to="/carrito" replace />

  const envioElegido = ENVIOS.find((e) => e.id === datos.envio)
  const totalConEnvio = total + envioElegido.costo

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value })

  const continuar = (e) => {
    e.preventDefault()
    setPaso(2)
  }

  const pagar = (e) => {
    e.preventDefault()
    // Acá va la llamada a tu pasarela de pago.
    setOrden(numeroOrden())
    vaciar()
  }

  const cerrarConfirmacion = () => {
    setOrden(null)
    navegar('/')
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Formulario */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="titulo-seccion">Facturación</h1>
            <div className="flex gap-2">
              <Paso numero={1} activo={paso === 1} />
              <Paso numero={2} activo={paso === 2} />
            </div>
          </div>

          {paso === 1 ? (
            <form onSubmit={continuar} className="mt-10 space-y-6">
              <div className="relative">
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                  <IconoUsuario tamano={18} />
                </span>
                <input
                  className="campo-linea"
                  placeholder="Nombre completo"
                  value={datos.nombre}
                  onChange={cambiar('nombre')}
                  required
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                  <IconoUbicacion tamano={18} />
                </span>
                <select
                  className="campo-linea appearance-none"
                  value={datos.provincia}
                  onChange={cambiar('provincia')}
                  aria-label="Provincia"
                >
                  {PROVINCIAS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <input
                className="campo-linea pl-0"
                placeholder="Dirección exacta"
                value={datos.direccion}
                onChange={cambiar('direccion')}
                required
              />

              <div className="relative">
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                  <IconoCaja tamano={18} />
                </span>
                <select
                  className="campo-linea appearance-none"
                  value={datos.envio}
                  onChange={cambiar('envio')}
                  aria-label="Opciones de envío"
                >
                  {ENVIOS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} — {e.costo === 0 ? 'gratis' : colones(e.costo)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                  <IconoTarjeta tamano={18} />
                </span>
                <select
                  className="campo-linea appearance-none"
                  value={datos.pago}
                  onChange={cambiar('pago')}
                  aria-label="Método de pago"
                >
                  {PAGOS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="boton-linea w-full">
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={pagar} className="mt-10">
              <div className="space-y-4 bg-niebla p-6 text-sm">
                <h2 className="text-sm font-bold tracking-[0.2em]">REVISÁ TUS DATOS</h2>
                <p>
                  <span className="text-gris">Nombre: </span>
                  {datos.nombre}
                </p>
                <p>
                  <span className="text-gris">Entrega: </span>
                  {datos.direccion}, {datos.provincia}
                </p>
                <p>
                  <span className="text-gris">Envío: </span>
                  {envioElegido.nombre}
                </p>
                <p>
                  <span className="text-gris">Pago: </span>
                  {datos.pago}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setPaso(1)} className="boton-linea sm:flex-1">
                  Volver
                </button>
                <button type="submit" className="boton-solido sm:flex-[2]">
                  Pagar {colones(totalConEnvio)}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Resumen */}
        <aside className="h-fit bg-niebla p-6 lg:sticky lg:top-40">
          <h2 className="text-sm font-bold tracking-[0.2em]">
            CARRITO <span className="text-gris">({lineas.length})</span>
          </h2>

          <div className="mt-2 max-h-96 overflow-y-auto pr-1">
            <LineasCarrito compacto />
          </div>

          <ResumenTotales />

          <div className="mt-3 flex justify-between border-t border-borde pt-3 text-sm">
            <span className="text-gris">Envío</span>
            <span>{envioElegido.costo === 0 ? 'Gratis' : colones(envioElegido.costo)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-bold">
            <span>Total a pagar</span>
            <span>{colones(totalConEnvio)}</span>
          </div>
        </aside>
      </div>

      {/* Confirmación */}
      {orden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pago realizado"
            className="w-full max-w-md bg-white px-8 py-12 text-center shadow-xl"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tinta text-white">
              <IconoCheck tamano={26} />
            </span>

            <h2 className="mt-6 text-xl font-bold">Pago realizado con éxito</h2>
            <p className="mt-2 text-sm text-gris">
              N.º de orden <span className="font-semibold text-tinta">{orden}</span>
            </p>
            <p className="mt-6 text-sm text-gris">
              Gracias por comprar en Bella Boutique. Te enviamos el comprobante por correo y te
              avisamos cuando el pedido salga.
            </p>

            <button type="button" onClick={cerrarConfirmacion} className="boton-solido mt-8 w-full">
              Volver al inicio
            </button>
            <Link
              to="/catalogo"
              onClick={() => setOrden(null)}
              className="mt-4 block text-xs text-gris underline transition hover:text-tinta"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
