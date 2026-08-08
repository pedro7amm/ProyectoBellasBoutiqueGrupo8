// Sin backend no se puede enviar un correo real: en vez de eso, generamos una
// contraseña temporal y se la mostramos en pantalla a quien la pidió.
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

export function generarClaveAleatoria(longitud = 10) {
  let clave = ''
  for (let i = 0; i < longitud; i++) {
    clave += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
  }
  return clave
}
