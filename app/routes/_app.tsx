import { signOut } from 'firebase/auth'
import { useState } from 'react'
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
import { AnimeCreateContext } from '~/context/anime-context'
import { useAuthenticated } from '~/context/auth-context'
import { auth } from '~/firebase.client'
import { useCreateAnime } from '~/hooks/anime/use-create-anime'

export default function AppLayout() {
  const { user } = useAuthenticated()
  const { mutateAsync: createAnime, isPending: isCreating } = useCreateAnime(
    user.uid,
  )

  async function handleLogout() {
    await signOut(auth)
  }

  const [isOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <AnimeCreateContext.Provider value={{ isOpen, openModal, closeModal }}>
      <div className="min-h-svh space-y-6 flex flex-col">
        <AppHeader user={user} onLogoutClick={handleLogout} />
        <Outlet />

        <Dialog open={isOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Добавить аниме</DialogTitle>
            </DialogHeader>
            <AnimeForm
              id="create-anime-form"
              onSubmit={async values => {
                await createAnime(values)
                closeModal()
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
    </AnimeCreateContext.Provider>
  )
}
