import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../features/admin/components/AdminLayout'
import DashboardPage from '../features/admin/pages/DashboardPage'
import ClientesPage from '../features/admin/pages/ClientesPage'
import NuevoClientePage from '../features/admin/pages/NuevoClientePage'
import EntrenamientosPage from '../features/admin/pages/EntrenamientosPage'
import FinanzasPage from '../features/admin/pages/FinanzasPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',       element: <DashboardPage /> },
      { path: 'clientes',        element: <ClientesPage /> },
      { path: 'clientes/nuevo',  element: <NuevoClientePage /> },
      { path: 'entrenamientos',  element: <EntrenamientosPage /> },
      { path: 'finanzas',        element: <FinanzasPage /> },
    ],
  },
])

export default router
