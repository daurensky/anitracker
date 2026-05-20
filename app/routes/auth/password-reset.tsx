import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import AppLogo from '~/components/app-logo'
import { PasswordResetForm } from '~/components/auth/password-reset-form'
import { auth } from '~/firebase.client'

export default function PasswordResetPage() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = new FormData(e.target)

      await sendPasswordResetEmail(auth, form.get('email') as string)
    },
    onSuccess: () => {
      toast.success('Письмо отправлено')
      navigate('/login')
    },
    onError: error => {
      console.error(error)

      if (
        error instanceof FirebaseError &&
        error.code === 'auth/invalid-email'
      ) {
        toast.error('Неверный email')
        return
      }

      toast.error('Неизвестная ошибка. Повторите попытку позже')
    },
  })

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/">
            <AppLogo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <PasswordResetForm
              onSubmit={mutation.mutate}
              isLoading={mutation.status === 'pending'}
              isError={mutation.isError}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="bg-login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
