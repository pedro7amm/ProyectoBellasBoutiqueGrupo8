import { useEffect, useRef, useState } from 'react'
import { useSesion } from '../../contexto/SesionContext.jsx'
import { useChat } from '../../contexto/ChatContext.jsx'
import { useSoporte } from '../../contexto/SoporteContext.jsx'
import { IconoEnviar, IconoEstrellaAdmin } from '../../componentes/admin/IconosAdmin.jsx'

function TabChatStaff() {
  const { usuarioActual } = useSesion()
  const { conversaciones, mensajesDeCliente, enviarMensaje, marcarLeidos } = useChat()
  const [clienteId, setClienteId] = useState(null)
  const [texto, setTexto] = useState('')
  const finRef = useRef(null)

  const lista = conversaciones()
  const activa = lista.find((c) => c.clienteId === clienteId) || lista[0] || null
  const mensajes = activa ? mensajesDeCliente(activa.clienteId) : []

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: 'nearest' })
  }, [mensajes.length])

  useEffect(() => {
    if (activa) marcarLeidos(activa.clienteId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa?.clienteId, mensajes.length, marcarLeidos])

  const enviar = (e) => {
    e.preventDefault()
    if (!texto.trim() || !activa) return
    enviarMensaje({
      clienteId: activa.clienteId,
      clienteNombre: activa.clienteNombre,
      de: 'staff',
      autor: usuarioActual?.nombre || 'Personal',
      texto: texto.trim(),
    })
    setTexto('')
  }

  if (lista.length === 0) {
    return (
      <div className="admin-card mt-6 px-8 py-16 text-center text-sm text-admin-muted">
        Todavía no hay conversaciones de clientes.
      </div>
    )
  }

  return (
    <div className="admin-card mt-6 grid grid-cols-[220px_1fr] overflow-hidden">
      <div className="border-r border-admin-bg">
        {lista.map((c) => (
          <button
            key={c.clienteId}
            type="button"
            onClick={() => setClienteId(c.clienteId)}
            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
              activa?.clienteId === c.clienteId
                ? 'bg-admin-bg font-semibold text-admin-ink'
                : 'text-admin-muted hover:bg-admin-bg/60'
            }`}
          >
            {c.clienteNombre}
            {mensajesDeCliente(c.clienteId).some((m) => m.de === 'cliente' && !m.leido) && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-admin-primary" aria-label="Mensajes sin leer" />
            )}
          </button>
        ))}
      </div>

      <div className="flex h-[440px] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {mensajes.map((m) => (
            <div
              key={m.id}
              className={`max-w-[75%] px-4 py-2 text-sm ${
                m.de === 'staff' ? 'ml-auto bg-admin-primary text-white' : 'bg-admin-bg text-admin-ink'
              }`}
            >
              {m.texto}
            </div>
          ))}
          <div ref={finRef} />
        </div>
        <form onSubmit={enviar} className="flex items-center gap-2 border-t border-admin-bg p-3">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Responder…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-admin-primary text-white transition hover:opacity-80"
            aria-label="Enviar respuesta"
          >
            <IconoEnviar tamano={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

function TabComentarios() {
  const { encuestas, sugerencias } = useSoporte()
  const promedio = encuestas.length
    ? (encuestas.reduce((s, e) => s + e.puntaje, 0) / encuestas.length).toFixed(1)
    : null

  return (
    <div className="mt-6 space-y-6">
      <div className="admin-card px-8 py-7">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-admin-ink">Encuestas de satisfacción</h2>
          {promedio && (
            <span className="flex items-center gap-1 text-sm font-semibold text-admin-ink">
              <IconoEstrellaAdmin tamano={16} />
              {promedio} promedio · {encuestas.length} respuestas
            </span>
          )}
        </div>
        {encuestas.length === 0 ? (
          <p className="mt-4 text-sm text-admin-muted">Todavía no hay encuestas.</p>
        ) : (
          <ul className="mt-4 divide-y divide-admin-bg">
            {encuestas.map((e) => (
              <li key={e.id} className="py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-admin-ink">{e.autor}</span>
                  <span className="text-admin-muted">{e.puntaje}/5</span>
                </div>
                {e.comentario && <p className="mt-1 text-admin-muted">{e.comentario}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-card px-8 py-7">
        <h2 className="text-lg font-bold text-admin-ink">Sugerencias</h2>
        {sugerencias.length === 0 ? (
          <p className="mt-4 text-sm text-admin-muted">Todavía no hay sugerencias.</p>
        ) : (
          <ul className="mt-4 divide-y divide-admin-bg">
            {sugerencias.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-admin-ink">
                    {s.autor} · {s.asunto}
                  </span>
                  <span className="text-xs text-admin-muted">{s.correo}</span>
                </div>
                <p className="mt-1 text-admin-muted">{s.mensaje}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function SoporteAdmin() {
  const [tab, setTab] = useState('chat')
  const { noLeidos } = useChat()

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-ink">Soporte</h1>

      <div className="mt-6 flex max-w-xs gap-1 rounded-[6px] bg-white p-1">
        {[
          { id: 'chat', etiqueta: 'Chat' },
          { id: 'comentarios', etiqueta: 'Comentarios' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`admin-tab flex items-center gap-2 ${tab === t.id ? 'admin-tab-activo' : 'admin-tab-inactivo'}`}
          >
            {t.etiqueta}
            {t.id === 'chat' && noLeidos > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-primary px-1 text-[10px] font-semibold text-white">
                {noLeidos}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'chat' ? <TabChatStaff /> : <TabComentarios />}
    </div>
  )
}
