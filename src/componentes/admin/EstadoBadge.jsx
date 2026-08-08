// El Figma usa dos estilos distintos segun la pantalla:
// - "texto": solo texto en color (usado para Disponible/Fuera de Stock y Enviado/Pendiente)
// - "pastilla": texto con fondo de color (usado para Activo/Inactivo de usuarios)

const TONOS_TEXTO = {
  positivo: 'text-admin-primary',
  negativo: 'text-admin-primary', // el Figma no distingue color aqui, solo cambia el texto
  neutro: 'text-admin-ink',
}

const TONOS_PASTILLA = {
  positivo: 'bg-admin-success-bg text-admin-success-text',
  negativo: 'bg-admin-danger-bg text-admin-danger-text',
  neutro: 'bg-admin-bg text-admin-muted',
}

export default function EstadoBadge({ estado, tono = 'neutro', estilo = 'texto' }) {
  if (estilo === 'pastilla') {
    return <span className={`admin-badge ${TONOS_PASTILLA[tono]}`}>{estado}</span>
  }
  return <span className={`text-sm font-medium ${TONOS_TEXTO[tono]}`}>{estado}</span>
}
