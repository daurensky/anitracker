import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '~/hooks/use-auth'

export default function ProtectedLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    if (!user.emailVerified) navigate('/verify-email', { replace: true })
  }, [user, loading])

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
        ЗАГРУЗКА...
      </div>
    )
  }

  return <Outlet />
}
