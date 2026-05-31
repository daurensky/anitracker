import { IconAlertCircle, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import AnimeCard from '~/components/anime-card'
import AnimeForm from '~/components/anime-form'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { Field } from '~/components/ui/field'
import { Headline } from '~/components/ui/headline'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Spinner } from '~/components/ui/spinner'
import { useCreateAnimeModal } from '~/context/anime-context'
import { useAuthenticated } from '~/context/auth-context'
import { useAnimeList, type AnimeFilter } from '~/hooks/anime/use-anime-list'
import { useDeleteAnime } from '~/hooks/anime/use-delete-anime'
import { useUpdateAnime } from '~/hooks/anime/use-update-anime'
import { useUpdateAnimeWatched } from '~/hooks/anime/use-update-anime-watched'
import type { AnimeItem } from '~/types'

const FILTERS: {
  value: AnimeFilter
  label: string
}[] = [
  { value: 'all', label: 'Все' },
  { value: 'watching', label: 'Смотрю' },
  { value: 'completed', label: 'Завершены' },
]

function EmptyAnimeList() {
  const { openModal } = useCreateAnimeModal()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">🍃</EmptyMedia>
        <EmptyTitle>Список пуст</EmptyTitle>
        <EmptyDescription>Добавьте первое аниме!</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={openModal}>
          <IconPlus />
          Добавить
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default function AnimeListSection() {
  const { user } = useAuthenticated()

  const [filter, setFilter] = useState<AnimeFilter>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const { data: animeList, status } = useAnimeList(
    user.uid,
    filter,
    debouncedSearch,
  )

  const { mutate: mutateWatched } = useUpdateAnimeWatched(user.uid)
  const { mutateAsync: updateAnime, isPending: isUpdating } = useUpdateAnime()
  const { mutateAsync: deleteAnime, isPending: isDeleting } = useDeleteAnime()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAnime, setEditingAnime] = useState<AnimeItem | null>(null)
  function openEditModal(anime: AnimeItem) {
    setIsEditOpen(true)
    setEditingAnime(anime)
  }
  function closeEditModal() {
    setIsEditOpen(false)
  }

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAnime, setDeletingAnime] = useState<AnimeItem | null>(null)
  function openDeleteModal(anime: AnimeItem) {
    setIsDeleteOpen(true)
    setDeletingAnime(anime)
  }
  function closeDeleteModal() {
    setIsDeleteOpen(false)
  }

  function handleWatchedEpChange(animeId: string) {
    return function (count: number) {
      mutateWatched({ id: animeId, ep_watched_count: count })
    }
  }

  function handleEditClick(anime: AnimeItem) {
    return function () {
      openEditModal(anime)
    }
  }

  function handleDeleteClick(anime: AnimeItem) {
    return function () {
      openDeleteModal(anime)
    }
  }

  return (
    <>
      <section>
        <div className="container mx-auto space-y-4">
          <Headline>Все аниме</Headline>

          <div className="flex justify-between">
            <div className="space-x-2">
              {FILTERS.map(f => (
                <Button
                  key={f.value}
                  variant={f.value === filter ? 'outline' : 'ghost'}
                  size="xs"
                  onClick={() => setFilter(f.value)}
                  className="data-[variant=ghost]:text-muted-foreground"
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <div>
              <Field orientation="horizontal">
                <Input
                  type="search"
                  placeholder="Поиск..."
                  onChange={e => setSearch(e.target.value)}
                />
              </Field>
            </div>
          </div>

          {status === 'pending' ? (
            <ul className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="w-full aspect-25/27" />
                </li>
              ))}
            </ul>
          ) : status === 'error' ? (
            <Alert variant="destructive" className="max-w-md">
              <IconAlertCircle />
              <AlertTitle>Что-то пошло не так</AlertTitle>
              <AlertDescription>
                Не удалось загрузить аниме из-за ошибки. Повторите попытку позже
              </AlertDescription>
            </Alert>
          ) : animeList.length > 0 ? (
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
      <Dialog open={isEditOpen} onOpenChange={closeEditModal}>
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
                closeEditModal()
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
      <Dialog open={isDeleteOpen} onOpenChange={closeDeleteModal}>
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
                  closeDeleteModal()
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
    </>
  )
}
