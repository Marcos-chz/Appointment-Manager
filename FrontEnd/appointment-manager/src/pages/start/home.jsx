// ClientLayout.jsx
import Sidebar from '../../components/SideBar'
import { Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <div className="d-flex min-vh-100 w-100">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
