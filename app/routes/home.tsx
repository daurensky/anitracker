import { IconAlertCircle } from '@tabler/icons-react'
import AnimeAddDialog from '~/components/anime-add-dialog'
import { Button } from '~/components/ui/button'
import { Field } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { useCreateAnime } from '~/hooks/anime/use-create-anime'
import type { Route } from './+types/home'

import AnimeCard from '~/components/anime-card'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { Headline } from '~/components/ui/headline'
import { Skeleton } from '~/components/ui/skeleton'
import { useAnimeList } from '~/hooks/anime/use-anime-list'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'AniTracker' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

function EmptyAnimeList() {
  const { mutateAsync, status } = useCreateAnime()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">🍃</EmptyMedia>
        <EmptyTitle>Список пуст</EmptyTitle>
        <EmptyDescription>Добавьте первое аниме!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <AnimeAddDialog
          onSubmit={mutateAsync}
          isLoading={status === 'pending'}
        />
      </EmptyContent>
    </Empty>
  )
}

export default function Home() {
  const { data: animeList, status } = useAnimeList()

  if (status === 'pending') {
    return (
      <main className="space-y-6">
        <Skeleton />
        <Skeleton />
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="space-y-6">
        <Alert variant="destructive" className="max-w-md">
          <IconAlertCircle />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            Your payment could not be processed. Please check your payment
            method and try again.
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <section>
        <div className="container mx-auto space-y-4">
          <Headline>Скоро выходят</Headline>
          <p className="text-sm text-muted-foreground">
            Нет активных аниме с расписанием
          </p>
        </div>
      </section>

      <section>
        <div className="container mx-auto space-y-4">
          <Headline>Все аниме</Headline>

          <div className="flex justify-between">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="xs"
                className="text-muted-foreground"
              >
                Все
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="text-muted-foreground"
              >
                Смотрю
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="text-muted-foreground"
              >
                Завершены
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="text-muted-foreground"
              >
                Запланированы
              </Button>
            </div>
            <div>
              <Field orientation="horizontal">
                <Input type="search" placeholder="Поиск..." />
              </Field>
            </div>
          </div>

          {animeList.length > 0 ? (
            <ul className="grid grid-cols-3 gap-4">
              {animeList.map(anime => (
                <li key={anime.id}>
                  <AnimeCard
                    coverUrl={anime.cover_url}
                    animeName={anime.name}
                    epCount={anime.ep_total_count}
                    watchedEpCount={anime.ep_watched_count}
                    watchUrl={anime.watch_url}
                    firstEpDate={anime.first_ep_date}
                    releaseDayNum={anime.ep_release_day}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyAnimeList />
          )}
        </div>
      </section>
    </main>
  )
}
