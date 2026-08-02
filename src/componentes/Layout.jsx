import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Encabezado from './Encabezado.jsx'
import MenuLateral from './MenuLateral.jsx'
import ModalAuth from './ModalAuth.jsx'
import PieDePagina from './PieDePagina.jsx'

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const { pathname } = useLocation()

  // Volver arriba al cambiar de página
useEffect(() => {
  window.scrollTo(0, 0)
}, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado
        alAbrirMenu={() => setMenuAbierto(true)}
        alAbrirCuenta={() => setCuentaAbierta(true)}
      />

      <MenuLateral abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />
      <ModalAuth abierto={cuentaAbierta} alCerrar={() => setCuentaAbierta(false)} />

      <main className="flex-1">
        <Outlet context={{ abrirCuenta: () => setCuentaAbierta(true) }} />
      </main>

      <PieDePagina />
    </div>
  )
}
