import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './AdminLayout.css'

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__main">
        <Outlet />
      </div>
    </div>
  )
}
