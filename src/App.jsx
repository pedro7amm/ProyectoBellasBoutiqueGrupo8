import { Link, Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout.jsx'
import Inicio from './paginas/Inicio.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import Carrito from './paginas/Carrito.jsx'
import Facturacion from './paginas/Facturacion.jsx'
import Ayuda from './paginas/Ayuda.jsx'
import MisPedidos from './paginas/MisPedidos.jsx'
import CuentaCliente from './paginas/CuentaCliente.jsx'
import FacturaDescarga from './paginas/FacturaDescarga.jsx'

import AdminLayout from './componentes/admin/AdminLayout.jsx'
import RutaProtegida from './componentes/admin/RutaProtegida.jsx'
import LoginAdmin from './paginas/admin/Login.jsx'
import ProductosAdmin from './paginas/admin/Productos.jsx'
import FacturacionAdmin from './paginas/admin/Facturacion.jsx'
import ReportesAdmin from './paginas/admin/Reportes.jsx'
import UsuariosAdmin from './paginas/admin/Usuarios.jsx'
import ConfiguracionAdmin from './paginas/admin/Configuracion.jsx'
import SoporteAdmin from './paginas/admin/Soporte.jsx'

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
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/cuenta" element={<CuentaCliente />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      <Route path="/factura/:numero" element={<FacturaDescarga />} />

      {/* Panel interno de administradores y vendedores (sin el header/footer de la tienda) */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida>
            <AdminLayout />
          </RutaProtegida>
        }
      >
        <Route index element={<ProductosAdmin />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="facturacion" element={<FacturacionAdmin />} />
        <Route
          path="reportes"
          element={
            <RutaProtegida soloAdmin>
              <ReportesAdmin />
            </RutaProtegida>
          }
        />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="soporte" element={<SoporteAdmin />} />
        <Route path="configuracion" element={<ConfiguracionAdmin />} />
      </Route>
    </Routes>
  )
}
