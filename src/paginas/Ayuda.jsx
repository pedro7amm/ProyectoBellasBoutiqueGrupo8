import { useEffect, useRef, useState } from 'react'
import { useClientes } from '../contexto/ClientesContext.jsx'
import { useSoporte } from '../contexto/SoporteContext.jsx'
import { useChat } from '../contexto/ChatContext.jsx'
import { IconoCorreo, IconoEnviar, IconoEstrella, IconoUsuario } from '../componentes/Iconos.jsx'

const ASUNTOS = [
  'Estado de mi pedido',
  'Cambios y devoluciones',
  'Tallas y disponibilidad',
  'Facturación',
  'Otro',
]

const FAQ = [
  {
    pregunta: '¿Cuánto tarda el envío?',
    respuesta:
      'La entrega en el GAM tarda de 1 a 2 días hábiles. Fuera del GAM, de 3 a 5 días hábiles con Correos de Costa Rica. También podés retirar en tienda sin costo.',
  },
  {
    pregunta: '¿Puedo cambiar o devolver una prenda?',
    respuesta:
      'Sí, tenés 8 días naturales desde que recibís el pedido para cambios o devoluciones, siempre que la prenda esté sin uso y con etiquetas.',
  },
  {
    pregunta: '¿Cómo sé qué talla pedir?',
    respuesta:
      'Cada producto muestra las tallas disponibles según su stock. Si tenés dudas puntuales, escribinos por el chat en vivo y te ayudamos.',
  },
  {
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Tarjeta Visa, MasterCard, SINPE Móvil y pago contra entrega.',
  },
  {
    pregunta: '¿Cómo veo el estado de mi pedido?',
    respuesta:
      'Iniciá sesión y entrá a "Mis pedidos" desde el ícono de tu cuenta — ahí vas a ver el estado, la fecha y el monto de cada compra.',
  },
]

function TabFAQ() {
  const [abierta, setAbierta] = useState(null)
  return (
    <div className="divide-y divide-borde border-y border-borde">
      {FAQ.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setAbierta((v) => (v === i ? null : i))}
            className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold"
            aria-expanded={abierta === i}
          >
            {item.pregunta}
            <span className="text-gris">{abierta === i ? '−' : '+'}</span>
          </button>
          {abierta === i && <p className="pb-5 text-sm text-gris">{item.respuesta}</p>}
        </div>
      ))}
    </div>
  )
}

function TabEncuesta() {
  const { clienteActual } = useClientes()
  const { enviarEncuesta } = useSoporte()
  const [puntaje, setPuntaje] = useState(0)
  const [comentario, setComentario] = useState('')
  const [nombre, setNombre] = useState('')
  const [enviado, setEnviado] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    if (!puntaje) return
    enviarEncuesta({
      autor: clienteActual ? clienteActual.nombre : nombre || 'Cliente anónimo',
      puntaje,
      comentario,
    })
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="border border-borde bg-niebla px-6 py-12 text-center">
        <p className="text-lg font-semibold">¡Gracias por tu opinión!</p>
        <p className="mt-2 text-sm text-gris">Nos ayuda a mejorar la experiencia de compra.</p>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      <div>
        <p className="text-sm font-semibold">¿Qué tan satisfecho estás con tu experiencia?</p>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPuntaje(n)}
              aria-pressed={puntaje === n}
              className={`transition ${n <= puntaje ? 'text-estrella' : 'text-borde hover:text-estrella'}`}
              aria-label={`${n} de 5`}
            >
              <IconoEstrella tamano={30} />
            </button>
          ))}
        </div>
      </div>

      {!clienteActual && (
        <div className="relative">
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
            <IconoUsuario tamano={18} />
          </span>
          <input
            className="campo-linea"
            placeholder="Tu nombre (opcional)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
      )}

      <textarea
        rows={4}
        className="w-full border-b border-borde bg-transparent py-3 text-sm placeholder:text-gris/70 focus:border-tinta focus:outline-none"
        placeholder="Contanos más (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button type="submit" disabled={!puntaje} className="boton-linea w-full disabled:opacity-40">
        Enviar encuesta
      </button>
    </form>
  )
}

function TabSugerencias() {
  const { clienteActual } = useClientes()
  const { enviarSugerencia } = useSoporte()
  const [enviado, setEnviado] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    const datos = new FormData(e.target)
    enviarSugerencia({
      autor: clienteActual ? clienteActual.nombre : datos.get('nombre'),
      correo: clienteActual ? clienteActual.correo : datos.get('correo'),
      asunto: datos.get('asunto'),
      mensaje: datos.get('mensaje'),
    })
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="border border-borde bg-niebla px-6 py-12 text-center">
        <p className="text-lg font-semibold">Sugerencia enviada</p>
        <p className="mt-2 text-sm text-gris">
          Le llega directo al administrador. Gracias por tomarte el tiempo.
        </p>
        <button type="button" onClick={() => setEnviado(false)} className="boton-linea mt-6">
          Enviar otra
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      {!clienteActual && (
        <>
          <div className="relative">
            <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
              <IconoUsuario tamano={18} />
            </span>
            <input name="nombre" className="campo-linea" placeholder="Nombre completo" required />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
              <IconoCorreo tamano={18} />
            </span>
            <input
              name="correo"
              type="email"
              className="campo-linea"
              placeholder="Correo electrónico"
              required
            />
          </div>
        </>
      )}

      <select name="asunto" className="campo-linea appearance-none pl-0" required defaultValue="">
        <option value="" disabled>
          Asunto
        </option>
        {ASUNTOS.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <textarea
        name="mensaje"
        rows={4}
        className="w-full border-b border-borde bg-transparent py-3 text-sm placeholder:text-gris/70 focus:border-tinta focus:outline-none"
        placeholder="Contanos qué necesitás"
        required
      />

      <button type="submit" className="boton-linea w-full">
        Enviar
      </button>
    </form>
  )
}

function TabChat() {
  const { clienteActual } = useClientes()
  const { mensajesDeCliente, enviarMensaje } = useChat()
  const [texto, setTexto] = useState('')
  const finRef = useRef(null)

  const mensajes = clienteActual ? mensajesDeCliente(clienteActual.id) : []

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: 'nearest' })
  }, [mensajes.length])

  if (!clienteActual) {
    return (
      <div className="border border-dashed border-borde px-6 py-16 text-center">
        <p className="text-sm font-semibold">Iniciá sesión para chatear con nosotras</p>
        <p className="mt-2 text-sm text-gris">
          Así podemos ver tu historial y responderte más rápido.
        </p>
      </div>
    )
  }

  const enviar = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    enviarMensaje({
      clienteId: clienteActual.id,
      clienteNombre: clienteActual.nombre,
      de: 'cliente',
      autor: clienteActual.nombre,
      texto: texto.trim(),
    })
    setTexto('')
  }

  return (
    <div className="flex h-[420px] flex-col border border-borde">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {mensajes.length === 0 && (
          <p className="mt-4 text-center text-xs text-gris">
            Escribinos tu consulta — un vendedor te responde por acá.
          </p>
        )}
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] px-4 py-2 text-sm ${
              m.de === 'cliente' ? 'ml-auto bg-tinta text-white' : 'bg-niebla text-tinta'
            }`}
          >
            {m.texto}
          </div>
        ))}
        <div ref={finRef} />
      </div>
      <form onSubmit={enviar} className="flex items-center gap-2 border-t border-borde p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí tu mensaje…"
          className="flex-1 bg-transparent text-sm placeholder:text-gris/70 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta text-white transition hover:opacity-80"
          aria-label="Enviar mensaje"
        >
          <IconoEnviar tamano={16} />
        </button>
      </form>
    </div>
  )
}

const TABS = [
  { id: 'faq', etiqueta: 'Preguntas frecuentes', Componente: TabFAQ },
  { id: 'encuesta', etiqueta: 'Encuesta de satisfacción', Componente: TabEncuesta },
  { id: 'sugerencias', etiqueta: 'Sugerencias', Componente: TabSugerencias },
  { id: 'chat', etiqueta: 'Chat en vivo', Componente: TabChat },
]

export default function Ayuda() {
  const [tab, setTab] = useState('faq')
  const Activo = TABS.find((t) => t.id === tab).Componente

  return (
    <>
      <section className="relative h-[40vh] min-h-64 overflow-hidden bg-tinta">
        <img src="/img/ayuda.jpg" alt="" className="h-full w-full object-cover opacity-70" />
        <h1 className="absolute inset-0 flex items-center justify-center px-5 text-center text-5xl font-extrabold leading-tight text-white sm:text-7xl">
          Ayuda al cliente
        </h1>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-16">
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-borde text-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 pb-3 font-semibold tracking-wide transition ${
                tab === t.id
                  ? 'border-tinta text-tinta'
                  : 'border-transparent text-gris hover:text-tinta'
              }`}
            >
              {t.etiqueta}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <Activo />
        </div>
      </section>
    </>
  )
}
