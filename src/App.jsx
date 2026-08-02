import { Link, Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout.jsx'
import Inicio from './paginas/Inicio.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import Carrito from './paginas/Carrito.jsx'
import Facturacion from './paginas/Facturacion.jsx'
import Ayuda from './paginas/Ayuda.jsx'

function NoEncontrada() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="text-sm tracking-[0.3em] text-gris">ERROR 404</p>
      <h1 className="mt-4 text-3xl font-bold">Esta página no existe</h1>
      <p className="mt-3 text-sm text-gris">
        Puede que el enlace esté viejo o que la prenda ya no esté publicada.
      </p>
      <Link to="/catalogo" className="boton-solido mt-8">
        Ver el catálogo
      </Link>
    </section>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/facturacion" element={<Facturacion />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
