import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import MyTasks from '../pages/MyTasks'
import CreateTask from '../pages/CreateTask'
import TaskDetails from '../pages/TaskDetails'
import EditTask from '../pages/EditTask'

import AdminDashboard from '../pages/AdminDashboard'
import AdminUsers from '../pages/AdminUsers'
import AdminAllTasks from '../pages/AdminAllTasks'
import AdminCreateTask from '../pages/AdminCreateTask'
import AdminTaskDetails from '../pages/AdminTaskDetails'
import AdminEditTask from '../pages/AdminEditTask'
import AdminEditUser from '../pages/AdminEditUser'
import AdminUserDetails from '../pages/AdminUserDetails'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/details" element={<TaskDetails />} />
          <Route path="/tasks/edit" element={<EditTask />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/edit" element={<AdminEditUser />} />
          <Route path="/admin/users/details" element={<AdminUserDetails />} />
          <Route path="/admin/tasks" element={<AdminAllTasks />} />
          <Route path="/admin/tasks/create" element={<AdminCreateTask />} />
          <Route path="/admin/tasks/details" element={<AdminTaskDetails />} />
          <Route path="/admin/tasks/edit" element={<AdminEditTask />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
