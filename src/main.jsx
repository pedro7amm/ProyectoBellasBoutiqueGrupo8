import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProveedorCarrito } from './contexto/CarritoContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorCarrito>
        <App />
      </ProveedorCarrito>
    </BrowserRouter>
  </StrictMode>,
)
