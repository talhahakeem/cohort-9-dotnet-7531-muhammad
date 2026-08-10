import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import MyTasks from '../pages/MyTasks'
import CreateTask from '../pages/CreateTask'
import TaskDetails from '../pages/TaskDetails'
import EditTask from '../pages/EditTask'
import AdminDashboard from '../pages/AdminDashboard'
import AdminLayout from '../layouts/AdminLayout'
import AdminUsers from '../pages/AdminUsers'

function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* User Dashboard */}
      <Route element={<DashboardLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/tasks" element={<MyTasks />} />
  <Route path="/tasks/create" element={<CreateTask />} />
  <Route path="/tasks/details" element={<TaskDetails />} />
  <Route path="/tasks/edit" element={<EditTask />} />
</Route>

<Route element={<AdminLayout />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/users" element={<AdminUsers />} />
</Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
