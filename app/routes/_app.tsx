import { signOut } from 'firebase/auth'
import { Outlet } from 'react-router'
import AnimeForm from '~/components/anime-form'
import AppHeader from '~/components/app-header'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { auth } from '~/firebase.client'
import { useCreateAnime } from '~/hooks/anime/use-create-anime'
import { useAnimeCreateStore } from '~/store/use-anime-create-store'

export default function AppLayout() {
  const { mutateAsync: createAnime, isPending: isCreating } = useCreateAnime()
  const { isOpen, close: closeAnimeCreating } = useAnimeCreateStore()

  const user = {
    name: 'DK',
    email: 'dkambarov17@gmail.com',
  }

  async function handleLogout() {
    await signOut(auth)
  }

  return (
    <div className="min-h-svh">
      <AppHeader user={user} onLogoutClick={handleLogout} />
      <Outlet />

      <Dialog open={isOpen} onOpenChange={closeAnimeCreating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать аниме</DialogTitle>
          </DialogHeader>
          <AnimeForm
            id="create-anime-form"
            onSubmit={async values => {
              await createAnime(values)
              closeAnimeCreating()
            }}
          />
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button
              form="create-anime-form"
              type="submit"
              disabled={isCreating}
            >
              {isCreating && <Spinner data-icon="inline-start" />}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
