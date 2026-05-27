import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AuthContext } from '~/context/auth-context'

export default function AuthenticatedLayout() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    if (!user.emailVerified) navigate('/verify-email', { replace: true })
  }, [user])

  if (!user) {
    return null
  }

  return <Outlet />
}
