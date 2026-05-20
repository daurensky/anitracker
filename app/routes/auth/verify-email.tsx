import { useMutation } from '@tanstack/react-query'
import { reload, sendEmailVerification } from 'firebase/auth'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import AppLogo from '~/components/app-logo'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { auth } from '~/firebase.client'

export default function VerifyEmailPage() {
  const user = auth.currentUser
  const navigate = useNavigate()

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (user) await sendEmailVerification(user)
    },
    onSuccess: () => {
      toast.success('Подтверждение отправлено')
    },
    onError: () => {
      toast.error('Произошла ошибка. Повторите попытку позже')
    },
  })

  function handleResend() {
    resendMutation.mutate()
  }

  const checkMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        await reload(user)
      }
    },
    onSuccess: () => {
      if (user?.emailVerified) navigate('/')
    },
    onError: () => {
      toast.error('Произошла ошибка. Повторите попытку позже')
    },
  })

  function handleCheck() {
    checkMutation.mutate()
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/">
            <AppLogo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-6">Подтвердите вашу почту</h1>
            <p className="text-sm mb-6">
              Письмо с подтверждением отправлено на почту {user?.email}
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleResend}
                variant="secondary"
                disabled={resendMutation.status === 'pending'}
              >
                {resendMutation.status === 'pending' && (
                  <Spinner data-icon="inline-start" />
                )}
                Отправить заново
              </Button>
              <Button
                onClick={handleCheck}
                disabled={checkMutation.status === 'pending'}
              >
                {checkMutation.status === 'pending' && (
                  <Spinner data-icon="inline-start" />
                )}
                Я подтвердил
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="bg-register.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
