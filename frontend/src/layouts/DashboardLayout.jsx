import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import './DashboardLayout.css'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Topbar />

        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default DashboardLayout