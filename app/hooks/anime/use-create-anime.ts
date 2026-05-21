import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'sonner'
import { db } from '~/firebase.client'
import type { AnimeItem } from '~/types'

type CreateAnimeInput = Omit<AnimeItem, 'id'>

const createAnimeFn = async (values: CreateAnimeInput) => {
  const ref = await addDoc(collection(db, 'anime'), {
    ...values,
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
      queryClient.invalidateQueries({ queryKey: ['anime'] }) // обновляет список
    },
    onError: err => {
      console.error(err)
      toast.error('Не удалось добавить аниме.')
    },
  })
}
