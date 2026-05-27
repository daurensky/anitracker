import type { User } from 'firebase/auth'
import { createContext, useContext } from 'react'

interface AuthContextValues {
  user: User | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  logout: () => {},
})

export function useAuthenticated() {
  const { user, logout } = useContext(AuthContext)

  if (!user) {
    throw new Error('useAuthenticated must be used in protected routes')
  }

  return { user, logout }
}
