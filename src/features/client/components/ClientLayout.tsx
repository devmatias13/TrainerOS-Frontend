import { Outlet } from 'react-router-dom'
import './ClientLayout.css'

export default function ClientLayout() {
  return (
    <div className="client-layout">
      <Outlet />
    </div>
  )
}
