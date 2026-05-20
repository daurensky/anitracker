import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '~/hooks/use-auth'

export default function AppLayout() {
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

  return (
    <>
      <header>
        <div className="logo">
          アニメ <span>трекер</span>
        </div>
        <div className="header-actions">
          <div className="stats-row" id="stats-row">
            <div className="stat">
              <strong>0</strong> всего
            </div>
            <div className="stat">
              <strong>0</strong> смотрю
            </div>
            <div className="stat">
              <strong>0</strong> завершено
            </div>
          </div>
          <button className="btn btn-primary">＋ Добавить</button>
        </div>
      </header>

      <Outlet />
    </>
  )
}
