import { useEffect, useState } from 'react'
import { profileApi } from '../../api/api'

function Topbar() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getProfile()
        setProfile(data)
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your tasks.</p>
      </div>

      <div className="topbar-actions">
        <button className="notification-btn" type="button">
          🔔
        </button>

        <div className="profile">
          <div className="avatar">{profile?.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div>
            <strong>{loading ? 'Loading...' : profile?.fullName || 'User'}</strong>
            <span>{profile?.role || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar