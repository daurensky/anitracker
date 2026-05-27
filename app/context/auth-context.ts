import type { User } from 'firebase/auth'
import { createContext, useContext } from 'react'

interface AuthContextValues {
  user: User | null
}

export const AuthContext = createContext<AuthContextValues>({
  user: null,
})

export function useAuthenticated() {
  const { user } = useContext(AuthContext)

  if (!user) {
    throw new Error('useAuthenticated must be used in protected routes')
  }

  return { user }
}
