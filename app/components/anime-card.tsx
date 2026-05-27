import {
  IconArrowUpRight,
  IconEdit,
  IconMinus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import { Field, FieldLabel } from '~/components/ui/field'

import { Link } from 'react-router'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { WEEKDAYS } from '~/constants'
import { calcReleasedEpisodes } from '~/lib/anime'
import { cn } from '~/lib/utils'

type AnimeCardProps = {
  coverUrl: string
  animeName: string
  epCount: number
  watchedEpCount: number
  watchUrl: string
  firstEpDate: string
  releaseDayNum: number
  onWatchedEpChange: (count: number) => void
  onEditClick: () => void
  onDeleteClick: () => void
} & React.ComponentProps<'div'>

export default function AnimeCard({
  coverUrl,
  animeName,
  epCount,
  watchedEpCount,
  watchUrl,
  firstEpDate,
  releaseDayNum,
  className,
  onWatchedEpChange,
  onEditClick,
  onDeleteClick,
  ...props
}: AnimeCardProps) {
  const releasedEpCount = calcReleasedEpisodes(
    firstEpDate,
    releaseDayNum,
    epCount,
  )

  return (
    <Card className={cn('w-full pt-0', className)} {...props}>
      <img
        src={coverUrl}
        alt=""
        className="relative z-20 aspect-video w-full object-cover"
      />

      <CardHeader>
        <CardTitle>{animeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex w-full flex-wrap gap-2">
          <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            Смотрю
          </Badge>
          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            {WEEKDAYS[releaseDayNum]}
          </Badge>
          <Badge className="bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
            Вышло: {releasedEpCount}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
            Всего: {epCount}
          </Badge>
        </div>
        <Field className="w-full">
          {releasedEpCount < epCount ? (
            <FieldLabel>
              <span className="text-muted-foreground">
                Прогресс (Смотрю / Вышло)
              </span>
              <span className="ml-auto">
                {watchedEpCount}/{releasedEpCount} из {epCount}{' '}
                {watchedEpCount < releasedEpCount && (
                  <span className="text-destructive">
                    (-{releasedEpCount - watchedEpCount} эп.)
                  </span>
                )}
              </span>
            </FieldLabel>
          ) : (
            <FieldLabel>
              <span className="text-muted-foreground">Прогресс</span>
              <span className="ml-auto">
                {watchedEpCount} из {epCount}
              </span>
            </FieldLabel>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onWatchedEpChange(watchedEpCount - 1)}
              disabled={watchedEpCount < 1}
            >
              <IconMinus />
            </Button>
            <div className="relative w-full">
              <Progress
                value={(watchedEpCount * 100) / epCount}
                className="w-full"
              />
              <Progress
                value={(releasedEpCount * 100) / epCount}
                className="w-full absolute top-0 left-0 opacity-30"
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onWatchedEpChange(watchedEpCount + 1)}
              disabled={watchedEpCount >= releasedEpCount}
            >
              <IconPlus />
            </Button>
          </div>
        </Field>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild>
          <Link to={watchUrl} target="_blank" rel="noopener noreferrer">
            <IconArrowUpRight />
            Смотреть
          </Link>
        </Button>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="icon" onClick={onEditClick}>
            <IconEdit />
          </Button>
          <Button variant="destructive" size="icon" onClick={onDeleteClick}>
            <IconTrash />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
