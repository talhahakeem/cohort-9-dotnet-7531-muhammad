import { Navigate, Outlet } from 'react-router-dom'
import { clearAuthSession, getCurrentUserRole, getToken, isTokenExpired } from '../utils/auth'

function ProtectedRoute({ allowedRoles }) {
  const token = getToken()

  if (!token || isTokenExpired()) {
    clearAuthSession()
    return <Navigate to="/login" replace />
  }

  const userRole = getCurrentUserRole()

  if (!allowedRoles) {
    return <Outlet />
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
