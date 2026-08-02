// Íconos SVG en línea (sin librerías). Todos heredan el color con currentColor.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

const Svg = ({ children, tamano = 20, ...props }) => (
  <svg {...base} width={tamano} height={tamano} aria-hidden="true" {...props}>
    {children}
  </svg>
)

export const IconoMenu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h11M4 17h7" />
  </Svg>
)

export const IconoCerrar = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)

export const IconoBuscar = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
)

export const IconoUsuario = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
  </Svg>
)

export const IconoCorazon = ({ relleno = false, ...p }) => (
  <Svg {...p} fill={relleno ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20z" />
  </Svg>
)

export const IconoBolsa = (p) => (
  <Svg {...p}>
    <path d="M6 8h12l-1 12H7L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
)

export const IconoCorreo = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Svg>
)

export const IconoCandado = (p) => (
  <Svg {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
)

export const IconoOjo = ({ oculto = false, ...p }) => (
  <Svg {...p}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
    <circle cx="12" cy="12" r="2.6" />
    {oculto && <path d="M4 20L20 4" />}
  </Svg>
)

export const IconoTelefono = (p) => (
  <Svg {...p}>
    <path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
)

export const IconoUbicacion = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
)

export const IconoCedula = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M15 10h4M15 13h3" />
  </Svg>
)

export const IconoCaja = (p) => (
  <Svg {...p}>
    <path d="M3 8l9-4 9 4-9 4-9-4z" />
    <path d="M3 8v8l9 4 9-4V8" />
  </Svg>
)

export const IconoTarjeta = (p) => (
  <Svg {...p}>
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <path d="M2 10h20" />
  </Svg>
)

export const IconoFiltro = (p) => (
  <Svg {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
)

export const IconoFlecha = ({ direccion = 'derecha', ...p }) => (
  <Svg {...p} style={{ transform: direccion === 'izquierda' ? 'rotate(180deg)' : undefined }}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const IconoChevron = ({ direccion = 'abajo', ...p }) => {
  const giro = { abajo: 0, arriba: 180, izquierda: 90, derecha: -90 }[direccion]
  return (
    <Svg {...p} style={{ transform: `rotate(${giro}deg)` }}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

export const IconoMas = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </Svg>
)

export const IconoMenos = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8" />
  </Svg>
)

export const IconoBasura = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </Svg>
)

export const IconoEstrella = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3.5z" />
  </Svg>
)

export const IconoCheck = (p) => (
  <Svg {...p}>
    <path d="M5 13l4 4 10-10" />
  </Svg>
)

export const IconoFacebook = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.2c0-.9.3-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H7.5v3h2.7v8h3.3z" />
  </Svg>
)

export const IconoInstagram = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconoTwitter = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M20 6.6c-.6.3-1.3.5-2 .6.7-.4 1.2-1.1 1.5-1.9-.7.4-1.5.7-2.3.9a3.5 3.5 0 0 0-6 3.2A10 10 0 0 1 4 5.7a3.5 3.5 0 0 0 1.1 4.7c-.6 0-1.1-.2-1.6-.4a3.5 3.5 0 0 0 2.8 3.5c-.5.1-1 .2-1.6.1a3.5 3.5 0 0 0 3.3 2.4A7 7 0 0 1 3 17.5a10 10 0 0 0 5.4 1.6c6.4 0 10-5.4 9.8-10.2.7-.5 1.3-1.2 1.8-2z" />
  </Svg>
)

export const IconoGoogle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 10.5h4a4 4 0 1 1-1.2-2.6" />
  </Svg>
)
