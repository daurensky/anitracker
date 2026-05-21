import {
  IconArrowUpRight,
  IconEdit,
  IconMinus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

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

const DAYS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

export function calcReleasedEpisodes(
  firstEpDate: string,
  releaseDay: number | null,
  totalEps: number,
): number {
  const first = new Date(firstEpDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  first.setHours(0, 0, 0, 0)

  if (first > today) return 0

  if (releaseDay === null) {
    const weeks = Math.floor(
      (today.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
    return Math.min(weeks + 1, totalEps)
  }

  const toJsDay = (d: number) => (d + 1) % 7

  const targetDay = toJsDay(releaseDay)
  const firstRelease = new Date(first)
  const diff = (targetDay - first.getDay() + 7) % 7
  firstRelease.setDate(firstRelease.getDate() + diff)

  if (firstRelease > today) return 0

  const weeks = Math.floor(
    (today.getTime() - firstRelease.getTime()) / (7 * 24 * 60 * 60 * 1000),
  )
  return Math.min(weeks + 1, totalEps)
}

type AnimeCardProps = {
  coverUrl: string
  animeName: string
  epCount: number
  watchedEpCount: number
  watchUrl: string
  firstEpDate: string
  releaseDayNum: number
}

export default function AnimeCard({
  coverUrl,
  animeName,
  epCount,
  watchedEpCount,
  watchUrl,
  firstEpDate,
  releaseDayNum,
}: AnimeCardProps) {
  const releasedEpCount = calcReleasedEpisodes(
    firstEpDate,
    releaseDayNum,
    epCount,
  )

  return (
    <Card className="w-full pt-0">
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
            {DAYS[releaseDayNum]}
          </Badge>
          <Badge className="bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
            Вышло: {releasedEpCount}
          </Badge>
          <Badge className="bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
            Всего: {epCount}
          </Badge>
        </div>
        <Field className="w-full">
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
          <Progress
            value={(watchedEpCount * 100) / epCount}
            className="w-full"
          />
        </Field>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon">
            <IconMinus />
          </Button>
          <Input
            value={watchedEpCount}
            type="number"
            className="text-center"
            placeholder="Просмотрено эпизодов"
          />
          <Button variant="secondary" size="icon">
            <IconPlus />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild>
          <Link to={watchUrl} target="_blank">
            <IconArrowUpRight />
            Смотреть
          </Link>
        </Button>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="icon">
            <IconEdit />
          </Button>
          <Button variant="destructive" size="icon">
            <IconTrash />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
