// ClientLayout.jsx
import Sidebar from '../../components/SideBar'
import { Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <div className="d-flex min-vh-100 w-100 bg-light">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-grow-1 overflow-auto">
        <div className="py-4 px-3 px-md-4">
          <Outlet />
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        /* Scrollbar personalizado para mejor apariencia */
        .overflow-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Transición suave para el contenido */
        .flex-grow-1 {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  )
}