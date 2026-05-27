import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { Field, FieldError, FieldGroup } from './ui/field'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { WEEKDAYS_SHORT } from '~/constants'

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Название обязательное')
    .max(255, 'Слишком длинно. Напиши режиссерам, чтоб сократили.'),
  ep_total_count: z
    .number()
    .min(1, 'Мало эпизодов.')
    .max(9999, 'Серьезно? Больше 10К эпизодов?'),
  ep_watched_count: z
    .number()
    .min(0, 'Отрицательные нельзя.')
    .max(9999, 'Серьезно? Больше 10К эпизодов?'),
  ep_release_day: z.number('Укажите день выхода').min(0, 'Нет.').max(9, 'Нет.'),
  first_ep_date: z.string().min(1, 'Укажи дату.'),
  cover_url: z.url('Некорректный URL.'),
  watch_url: z.url('Некорректный URL.'),
})

type FormValues = z.infer<typeof formSchema>

type AnimeFormProps = Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
  onSubmit: (values: FormValues) => Promise<unknown>
  defaultValues?: FormValues | null
}

export default function AnimeForm({
  onSubmit,
  defaultValues,
  ...props
}: AnimeFormProps) {
  const form = useForm({
    defaultValues: defaultValues || {
      name: '',
      ep_total_count: 12,
      ep_watched_count: 0,
      ep_release_day: 4,
      first_ep_date: '',
      cover_url: '',
      watch_url: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await onSubmit(value)
      formApi.reset()
    },
  })

  return (
    <form
      {...props}
      onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {/* Название */}
        <form.Field name="name">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <Label htmlFor={field.name}>Название</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Название аниме"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          {/* Эпизодов всего */}
          <form.Field name="ep_total_count">
            {field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <Label htmlFor={field.name}>Эпизодов всего</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.valueAsNumber)}
                    placeholder="12"
                    min={1}
                    max={9999}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          {/* Просмотрено */}
          <form.Field name="ep_watched_count">
            {field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <Label htmlFor={field.name}>Просмотрено</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.valueAsNumber)}
                    placeholder="0"
                    min={0}
                    max={9999}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </div>

        {/* День выхода серии */}
        <form.Field name="ep_release_day">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <Label>День выхода серии</Label>
                <ToggleGroup
                  type="single"
                  value={field.state.value?.toString() ?? ''}
                  onValueChange={val => val && field.handleChange(Number(val))}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                >
                  {WEEKDAYS_SHORT.map((day, i) => (
                    <ToggleGroupItem
                      variant="outline"
                      key={day}
                      value={i.toString()}
                      className="data-[state=off]:text-muted-foreground"
                    >
                      {day}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Дата первой серии */}
        <form.Field name="first_ep_date">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <Label htmlFor={field.name}>Дата выхода (1-й серии)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Ссылка просмотра */}
        <form.Field name="watch_url">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <Label htmlFor={field.name}>Сайт для просмотра (URL)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="https://..."
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Обложка */}
        <form.Field name="cover_url">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <Label htmlFor={field.name}>Обложка (URL)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="https://..."
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>
    </form>
  )
}
