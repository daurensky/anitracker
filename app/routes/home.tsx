import { IconAlertCircle, IconPlus } from '@tabler/icons-react'
import AnimeForm from '~/components/anime-form'
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
import { useUpdateAnimeWatched } from '~/hooks/anime/use-update-anime-watched'
import { useAnimeCreateStore } from '~/store/use-anime-create-store'
import { useUpdateAnime } from '~/hooks/anime/use-update-anime'
import { useAnimeEditStore } from '~/store/use-anime-edit-store'
import { Spinner } from '~/components/ui/spinner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import type { AnimeItem } from '~/types'
import { useAnimeDeleteStore } from '~/store/use-anime-delete-store'
import { useDeleteAnime } from '~/hooks/anime/use-delete-anime'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'AniTracker' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

function EmptyAnimeList() {
  const { open } = useAnimeCreateStore()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">🍃</EmptyMedia>
        <EmptyTitle>Список пуст</EmptyTitle>
        <EmptyDescription>Добавьте первое аниме!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={open}>
          <IconPlus />
          Добавить
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default function Home() {
  const { data: animeList, status } = useAnimeList()
  const { mutate: mutateWatched } = useUpdateAnimeWatched()
  const { mutateAsync: updateAnime, isPending: isUpdating } = useUpdateAnime()
  const { mutateAsync: deleteAnime, isPending: isDeleting } = useDeleteAnime()
  const {
    isOpen: isEditingOpen,
    anime: editingAnime,
    open: openAnimeEditing,
    close: closeAnimeEditing,
  } = useAnimeEditStore()
  const {
    isOpen: isDeletingOpen,
    anime: deletingAnime,
    open: openAnimeDeleting,
    close: closeAnimeDeleting,
  } = useAnimeDeleteStore()

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

  function handleWatchedEpChange(animeId: string) {
    return function (count: number) {
      mutateWatched({ id: animeId, ep_watched_count: count })
    }
  }

  function handleEditClick(anime: AnimeItem) {
    return function () {
      openAnimeEditing(anime)
    }
  }

  function handleDeleteClick(anime: AnimeItem) {
    return function () {
      openAnimeDeleting(anime)
    }
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
              {animeList.map((anime, i) => (
                <li key={anime.id}>
                  <AnimeCard
                    coverUrl={anime.cover_url}
                    animeName={anime.name}
                    epCount={anime.ep_total_count}
                    watchedEpCount={anime.ep_watched_count}
                    watchUrl={anime.watch_url}
                    firstEpDate={anime.first_ep_date}
                    releaseDayNum={anime.ep_release_day}
                    onWatchedEpChange={handleWatchedEpChange(anime.id)}
                    onEditClick={handleEditClick(anime)}
                    onDeleteClick={handleDeleteClick(anime)}
                    className="animate-fade-up opacity-0"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyAnimeList />
          )}
        </div>
      </section>

      {/* Edit dialog */}
      <Dialog open={isEditingOpen} onOpenChange={closeAnimeEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать аниме</DialogTitle>
          </DialogHeader>
          <AnimeForm
            id="edit-anime-form"
            defaultValues={editingAnime}
            onSubmit={async values => {
              if (editingAnime) {
                await updateAnime({ id: editingAnime.id, ...values })
                closeAnimeEditing()
              }
            }}
          />
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button form="edit-anime-form" type="submit" disabled={isUpdating}>
              {isUpdating && <Spinner data-icon="inline-start" />}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={isDeletingOpen} onOpenChange={closeAnimeDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">{deletingAnime?.name}</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить это аниме? Это действие необратимо
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Нет
              </Button>
            </DialogClose>
            <Button
              onClick={async () => {
                if (deletingAnime) {
                  await deleteAnime(deletingAnime.id)
                  closeAnimeDeleting()
                }
              }}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting && <Spinner data-icon="inline-start" />}
              Да
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
