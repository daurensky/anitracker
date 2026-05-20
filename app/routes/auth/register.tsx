import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import AppLogo from '~/components/app-logo'
import { RegisterForm } from '~/components/auth/register-form'
import { auth } from '~/firebase.client'
import type { Route } from './+types/register'
import { ModeToggle } from '~/components/mode-toggle'
import { Separator } from '~/components/ui/separator'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Регистрация' },
    {
      name: 'description',
      content: 'Зарегистрируйся в AniTracker прям сейчас',
    },
  ]
}

export default function RegisterPage() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = new FormData(e.target)

      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.get('email') as string,
        form.get('password') as string,
      )
      await sendEmailVerification(userCred.user)

      navigate('/verify-email')
    },
    onSuccess: () => {},
    onError: error => {
      console.error(error)

      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      ) {
        toast.error('Данный email уже зарегистрирован')
        return
      }

      toast.error('Неизвестная ошибка. Повторите попытку позже')
    },
  })

  async function handleGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider())
    navigate('/')
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-2">
          <Link to="/">
            <AppLogo />
          </Link>

          <Separator orientation="vertical" className="mx-4" />

          <ModeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm
              onSubmit={mutation.mutate}
              onGoogleClick={handleGoogle}
              isError={mutation.isError}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="bg-register.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>
    </div>
  )
}
