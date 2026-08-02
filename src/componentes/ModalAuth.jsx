import { useEffect, useState } from 'react'
import {
  IconoCandado,
  IconoCedula,
  IconoCerrar,
  IconoCorreo,
  IconoFacebook,
  IconoGoogle,
  IconoInstagram,
  IconoOjo,
  IconoTelefono,
  IconoUbicacion,
  IconoUsuario,
} from './Iconos.jsx'

const Campo = ({ icono: Icono, ...props }) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
      <Icono tamano={18} />
    </span>
    <input className="campo-linea" {...props} />
  </div>
)

export default function ModalAuth({ abierto, alCerrar, pestanaInicial = 'sesion' }) {
  const [pestana, setPestana] = useState(pestanaInicial)
  const [verClave, setVerClave] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
  setPestana(pestanaInicial)
}, [pestanaInicial, abierto])

  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && alCerrar()
    if (abierto) {
      document.addEventListener('keydown', alPresionar)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = ''
    }
  }, [abierto, alCerrar])

  if (!abierto) return null

  const enviar = (e) => {
    e.preventDefault()
    // Acá va la llamada a tu API de autenticación.
    setMensaje(
      pestana === 'sesion'
        ? 'Falta conectar el inicio de sesión con el servidor.'
        : 'Falta conectar el registro con el servidor.',
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div
        className="absolute inset-0"
        onClick={alCerrar}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Acceso a la cuenta"
        className="relative w-full max-w-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-borde px-8 py-5">
          <div className="flex gap-6 text-sm">
            <button
              type="button"
              onClick={() => setPestana('sesion')}
              className={pestana === 'sesion' ? 'font-semibold' : 'text-gris hover:text-tinta'}
            >
              Inicio de sesión
            </button>
            <button
              type="button"
              onClick={() => setPestana('registro')}
              className={pestana === 'registro' ? 'font-semibold' : 'text-gris hover:text-tinta'}
            >
              Registrarse
            </button>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="p-1 transition hover:opacity-60"
            aria-label="Cerrar"
          >
            <IconoCerrar tamano={22} />
          </button>
        </div>

        <div className="px-8 py-8">
          <img src="/img/logo.png" alt="Bella Boutique" className="mx-auto h-11 w-auto" />

          <h2 className="mt-6 text-center text-xl font-bold">
            {pestana === 'sesion' ? 'Inicio de sesión' : 'Registro de usuario'}
          </h2>

          <form onSubmit={enviar} className="mt-8 space-y-5">
            {pestana === 'registro' && (
              <>
                <Campo icono={IconoCedula} name="cedula" placeholder="Cédula" required />
                <Campo icono={IconoUsuario} name="nombre" placeholder="Nombre" required />
                <Campo icono={IconoUsuario} name="apellidos" placeholder="Apellidos" required />
              </>
            )}

            <Campo icono={IconoCorreo} type="email" name="email" placeholder="Email" required />

            {pestana === 'registro' && (
              <>
                <div className="relative flex items-center gap-3 border-b border-borde focus-within:border-tinta">
                  <span className="text-gris">
                    <IconoTelefono tamano={18} />
                  </span>
                  <span className="text-sm text-gris">+506</span>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="ej. 8888 8888"
                    className="w-full bg-transparent py-3 text-sm placeholder:text-gris/70 focus:outline-none"
                    required
                  />
                </div>
                <Campo icono={IconoUbicacion} name="direccion" placeholder="Dirección" required />
              </>
            )}

            <div className="relative">
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-gris">
                <IconoCandado tamano={18} />
              </span>
              <input
                type={verClave ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                className="campo-linea pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setVerClave((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gris transition hover:text-tinta"
                aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <IconoOjo tamano={18} oculto={verClave} />
              </button>
            </div>

            {pestana === 'sesion' && (
              <p className="text-center">
                <button type="button" className="text-xs text-gris underline hover:text-tinta">
                  ¿Olvidó la contraseña?
                </button>
              </p>
            )}

            {mensaje && (
              <p className="border border-borde bg-humo px-4 py-3 text-center text-xs text-gris">
                {mensaje}
              </p>
            )}

            <button type="submit" className="boton-linea w-full">
              {pestana === 'sesion' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          </form>

          {pestana === 'sesion' && (
            <div className="mt-8 border-t border-borde pt-6">
              <p className="text-center text-xs tracking-wide text-gris">Redes sociales</p>
              <div className="mt-4 flex justify-center gap-4">
                {[IconoFacebook, IconoGoogle, IconoInstagram].map((Icono, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-borde transition hover:border-tinta"
                    aria-label="Continuar con red social"
                  >
                    <Icono tamano={18} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
