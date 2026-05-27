import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'sonner'
import { db } from '~/firebase.client'
import type { AnimeItem } from '~/types'

type CreateAnimeInput = Omit<AnimeItem, 'id'>

export function useCreateAnime(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateAnimeInput) =>
      addDoc(collection(db, 'anime'), {
        ...values,
        userId,
        created_at: serverTimestamp(),
      }),
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
