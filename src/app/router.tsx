import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../features/admin/components/AdminLayout'
import DashboardPage from '../features/admin/pages/DashboardPage'
import ClientesPage from '../features/admin/pages/ClientesPage'
import NuevoClientePage from '../features/admin/pages/NuevoClientePage'
import EntrenamientosPage from '../features/admin/pages/EntrenamientosPage'
import ArmarRutinaPage from '../features/admin/pages/ArmarRutinaPage'
import FinanzasPage from '../features/admin/pages/FinanzasPage'
import ExerciseBankPage from '../features/exercises/pages/ExerciseBankPage'
import NuevoEjercicioPage from '../features/exercises/pages/NuevoEjercicioPage'
// Client (alumno) feature
import ClientLayout from '../features/client/components/ClientLayout'
import ClientDashboard from '../features/client/pages/ClientDashboard'
import WorkoutSessionPage from '../features/client/pages/WorkoutSessionPage'
import ExerciseDetailPage from '../features/client/pages/ExerciseDetailPage'

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
      { path: 'dashboard',                            element: <DashboardPage /> },
      { path: 'clientes',                             element: <ClientesPage /> },
      { path: 'clientes/nuevo',                       element: <NuevoClientePage /> },
      { path: 'entrenamientos',                       element: <EntrenamientosPage /> },
      { path: 'entrenamientos/rutinas/nueva',         element: <ArmarRutinaPage /> },
      { path: 'entrenamientos/ejercicios',            element: <ExerciseBankPage /> },
      { path: 'entrenamientos/ejercicios/nuevo',      element: <NuevoEjercicioPage /> },
      { path: 'finanzas',                             element: <FinanzasPage /> },
    ],
  },
  // ── Client (Alumno) routes — completely separate from admin ──
  {
    path: '/alumno',
    element: <ClientLayout />,
    children: [
      { index: true, element: <Navigate to="/alumno/cliente-001" replace /> },
      {
        path: ':clienteId',
        element: <ClientDashboard />,
      },
      {
        path: ':clienteId/sesion/:sesionId',
        element: <WorkoutSessionPage />,
      },
      {
        path: ':clienteId/sesion/:sesionId/ejercicio/:ejercicioId',
        element: <ExerciseDetailPage />,
      },
    ],
  },
])

export default router
