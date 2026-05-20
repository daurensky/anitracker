import { signOut } from 'firebase/auth'
import { Outlet } from 'react-router'
import AppHeader from '~/components/app-header'
import { auth } from '~/firebase.client'

export default function AppLayout() {
  const user = {
    name: 'DK',
    email: 'dkambarov17@gmail.com',
  }

  async function handleLogout() {
    await signOut(auth)
  }

  return (
    <div className="min-h-svh">
      <AppHeader user={user} onLogoutClick={handleLogout} />
      <Outlet />
    </div>
  )
}
