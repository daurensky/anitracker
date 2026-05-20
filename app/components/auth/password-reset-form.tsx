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

type PasswordResetFormProps = {
  isError?: boolean
  isLoading?: boolean
} & React.ComponentProps<'form'>

export function PasswordResetForm({
  isError,
  isLoading,
  className,
  ...props
}: PasswordResetFormProps) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Восстановление пароля</h1>
          <p className="text-sm text-balance text-muted-foreground">
            На ваш email придет ссылка для сброса пароля
          </p>
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
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner data-icon="inline-start" />}
            Отправить
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Вспомнили пароль?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Вход
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
