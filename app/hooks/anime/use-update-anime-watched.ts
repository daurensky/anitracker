import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '~/firebase.client'
import { toast } from 'sonner'
import type { AnimeItem } from '~/types'

type UpdateWatchedInput = Pick<AnimeItem, 'id' | 'ep_watched_count'>

export function useUpdateAnimeWatched() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ep_watched_count }: UpdateWatchedInput) =>
      updateDoc(doc(db, 'anime', id), { ep_watched_count }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] })
    },
    onError: () => {
      toast.error('Не удалось обновить прогресс.')
    },
  })
}
