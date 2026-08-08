// Usuarios internos (administradores y vendedores) de ejemplo.
// No hay backend: esto sirve como semilla inicial para la sesión del navegador.
// En producción esto vendría de una API con contraseñas ya encriptadas.

export const ROLES = ['Administrador', 'Vendedor']

export const usuariosSemilla = [
  {
    id: 1,
    usuario: 'Admin',
    nombre: 'José Rodríguez',
    correo: 'jose@bellas.com',
    clave: 'admin123',
    rol: 'Administrador',
    estado: 'Activo',
  },
  {
    id: 2,
    usuario: 'MariaBellas',
    nombre: 'Maria Gomez',
    correo: 'maria@bellas.com',
    clave: 'venta123',
    rol: 'Vendedor',
    estado: 'Activo',
  },
  {
    id: 3,
    usuario: 'AndresBellas',
    nombre: 'Andres Vargas',
    correo: 'andres@bellas.com',
    clave: 'venta123',
    rol: 'Vendedor',
    estado: 'Inactivo',
  },
]

/** Iniciales para el avatar circular, ej. "Maria Gomez" -> "MG" */
export const iniciales = (nombreCompleto) =>
  nombreCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join('')
