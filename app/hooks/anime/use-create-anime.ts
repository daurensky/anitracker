import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { toast } from 'sonner'
import { db } from '~/firebase.client'
import type { AnimeItem } from '~/types'

type CreateAnimeInput = Omit<AnimeItem, 'id'>

const createAnimeFn = async (values: CreateAnimeInput) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) throw new Error('Пользователь не авторизован')

  const ref = await addDoc(collection(db, 'anime'), {
    ...values,
    userId: user.uid,
    created_at: serverTimestamp(),
  })
  return ref
}

export function useCreateAnime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAnimeFn,
    onSuccess: () => {
      toast.success('Аниме добавлено!')
      queryClient.invalidateQueries({ queryKey: ['anime'] })
    },
    onError: err => {
      console.error(err)
      toast.error('Не удалось добавить аниме.')
    },
  })
}
