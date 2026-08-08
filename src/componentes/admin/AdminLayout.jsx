import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-admin-bg font-admin text-admin-ink">
      <Sidebar />
      <main className="min-w-0 flex-1 px-10 py-9 print:px-0 print:py-0">
        <Outlet />
      </main>
    </div>
  )
}
