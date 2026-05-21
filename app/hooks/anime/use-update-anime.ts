import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '~/firebase.client'
import { toast } from 'sonner'
import type { AnimeItem } from '~/types'

type UpdateAnimeInput = AnimeItem

export function useUpdateAnime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...values }: UpdateAnimeInput) =>
      updateDoc(doc(db, 'anime', id), values),
    onSuccess: () => {
      toast.success('Аниме обновлено!')
      queryClient.invalidateQueries({ queryKey: ['anime'] })
    },
    onError: () => {
      toast.error('Не удалось обновить аниме.')
    },
  })
}
