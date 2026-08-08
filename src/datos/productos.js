// Datos de ejemplo. Cuando conectes una API, reemplazá este arreglo por un fetch
// y mantené la misma forma de objeto para no tocar los componentes.

export const GENEROS = ['Dama', 'Caballero']

// Categorías predeterminadas por género, para el formulario de "Agregar Producto"
// del panel de vendedores/administradores (así solo eligen de una lista, no escriben texto libre).
export const CATEGORIAS_POR_GENERO = {
  Dama: ['Vestidos', 'Tops', 'Pantalones', 'Calzado', 'Jaket, Cardigan, Sweater', 'Accesorios'],
  Caballero: ['Camisas', 'Pantalones', 'Calzado', 'Jaket, Cardigan, Sweater', 'Accesorios'],
}

// Lista plana (todas las categorías, sin repetir) que usan los filtros del catálogo del cliente.
export const CATEGORIAS = [...new Set(Object.values(CATEGORIAS_POR_GENERO).flat())]

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL']

/** Suma el inventario de todas las tallas de un producto: { S: 5, M: 2 } -> 7 */
export const stockTotal = (tallas) => Object.values(tallas || {}).reduce((s, n) => s + (n || 0), 0)

export const productos = [
  {
    id: 1,
    genero: 'Dama',
    nombre: 'Camisa negra',
    descripcion: 'Manga corta, algodón peinado',
    categoria: 'Tops',
    proveedor: 'PROV1',
    precio: 12000,
    precioAnterior: null,
    tallas: { XS: 2, S: 3, M: 3, L: 2, XL: 0 },
    calificacion: 4.7,
    imagen: '/img/productos/camisa.jpg',
    etiqueta: null,
  },
  {
    id: 2,
    genero: 'Dama',
    nombre: 'Pantalón recto',
    descripcion: 'Tiro alto, mezclilla negra',
    categoria: 'Pantalones',
    proveedor: 'PROV2',
    precio: 18500,
    precioAnterior: 22000,
    tallas: { XS: 0, S: 3, M: 5, L: 4, XL: 3 },
    calificacion: 4.5,
    imagen: '/img/productos/pantalon.jpg',
    etiqueta: 'Descuento 15%',
  },
  {
    id: 3,
    genero: 'Dama',
    nombre: 'Vestido midi',
    descripcion: 'Falda amplia, tela fresca',
    categoria: 'Vestidos',
    proveedor: 'PROV1',
    precio: 24000,
    precioAnterior: null,
    tallas: { XS: 3, S: 4, M: 3, L: 0, XL: 0 },
    calificacion: 4.8,
    imagen: '/img/productos/vestido.jpg',
    etiqueta: 'Nueva colección',
  },
  {
    id: 4,
    genero: 'Caballero',
    nombre: 'Tenis old school',
    descripcion: 'Lona blanca y negra, suela de goma',
    categoria: 'Calzado',
    proveedor: 'PROV3',
    precio: 26000,
    precioAnterior: null,
    tallas: { XS: 0, S: 1, M: 2, L: 2, XL: 0 },
    calificacion: 4.6,
    imagen: '/img/productos/tenis.jpg',
    etiqueta: null,
  },
  {
    id: 5,
    genero: 'Dama',
    nombre: 'Top corto',
    descripcion: 'Escote cruzado, satinado',
    categoria: 'Tops',
    proveedor: 'PROV2',
    precio: 20000,
    precioAnterior: null,
    tallas: { XS: 2, S: 4, M: 4, L: 2, XL: 0 },
    calificacion: 4.9,
    imagen: '/img/productos/top-corto.jpg',
    etiqueta: 'Nueva colección',
  },
  {
    id: 6,
    genero: 'Dama',
    nombre: 'Vestido vintage Y2K',
    descripcion: 'Estampado retro, corte asimétrico',
    categoria: 'Vestidos',
    proveedor: 'PROV1',
    precio: 12500,
    precioAnterior: 16000,
    tallas: { XS: 0, S: 2, M: 4, L: 2, XL: 0 },
    calificacion: 4.4,
    imagen: '/img/productos/vestido-y2k.jpg',
    etiqueta: 'Descuento 20%',
  },
]

export const buscarProducto = (id) => productos.find((p) => p.id === Number(id))
