import { cn } from '~/lib/utils'
import { Separator } from './separator'

function Headline({
  children,
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'tracking-widest uppercase text-xs font-medium text-muted-foreground flex items-center gap-2',
        className,
      )}
      {...props}
    >
      {children}
      <Separator className="flex-1" />
    </h2>
  )
}

export { Headline }
