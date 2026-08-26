import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { PortalSplash } from './PortalSplash'

/** Requires an authenticated, active staff profile. */
export function RequireStaff() {
  const { session, profile, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) return <PortalSplash variant="unconfigured" />
  if (loading) return <PortalSplash variant="loading" />
  if (!session) return <Navigate to="/portal/login" state={{ from: location }} replace />
  if (!profile) return <PortalSplash variant="no-profile" />
  if (!profile.is_active) return <PortalSplash variant="deactivated" />

  return <Outlet />
}

/** Requires the admin role on top of RequireStaff. */
export function RequireAdmin() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/portal" replace />
  return <Outlet />
}
