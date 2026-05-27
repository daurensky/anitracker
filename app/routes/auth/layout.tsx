import { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AuthContext } from '~/context/auth-context'

export default function AuthLayout() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.emailVerified) navigate('/', { replace: true })
  }, [user])

  if (user) {
    return null
  }

  return <Outlet />
}
