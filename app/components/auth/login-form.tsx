import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { Spinner } from '../ui/spinner'

type LoginFormProps = {
  isError?: boolean
  isLoading?: boolean
  onGoogleClick?: () => void
} & React.ComponentProps<'form'>

export function LoginForm({
  isError,
  isLoading,
  onGoogleClick,
  className,
  ...props
}: LoginFormProps) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Вход</h1>
        </div>
        <Field data-invalid={isError}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
            aria-invalid={isError}
          />
        </Field>
        <Field data-invalid={isError}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Пароль</FieldLabel>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            disabled={isLoading}
            aria-invalid={isError}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner data-icon="inline-start" />}
            Войти
          </Button>
        </Field>
        <FieldSeparator>Или продолжить через</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={onGoogleClick}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Войти через Google
          </Button>
          <FieldDescription className="text-center">
            Нет аккаунта?{' '}
            <Link to="/register" className="underline underline-offset-4">
              Регистрация
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
