import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProveedorCarrito } from './contexto/CarritoContext.jsx'
import { ProveedorSesion } from './contexto/SesionContext.jsx'
import { ProveedorClientes } from './contexto/ClientesContext.jsx'
import { ProveedorProductos } from './contexto/ProductosContext.jsx'
import { ProveedorPedidos } from './contexto/PedidosContext.jsx'
import { ProveedorBitacora } from './contexto/BitacoraContext.jsx'
import { ProveedorSoporte } from './contexto/SoporteContext.jsx'
import { ProveedorChat } from './contexto/ChatContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorBitacora>
        <ProveedorSesion>
          <ProveedorClientes>
            <ProveedorPedidos>
              <ProveedorProductos>
                <ProveedorSoporte>
                  <ProveedorChat>
                    <ProveedorCarrito>
                      <App />
                    </ProveedorCarrito>
                  </ProveedorChat>
                </ProveedorSoporte>
              </ProveedorProductos>
            </ProveedorPedidos>
          </ProveedorClientes>
        </ProveedorSesion>
      </ProveedorBitacora>
    </BrowserRouter>
  </StrictMode>,
)
