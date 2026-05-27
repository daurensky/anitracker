import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '~/firebase.client'
import { toast } from 'sonner'
import { useRef } from 'react'
import type { AnimeItem } from '~/types'

type UpdateWatchedInput = Pick<AnimeItem, 'id' | 'ep_watched_count'>

export function useUpdateAnimeWatched(userId: string) {
  const queryClient = useQueryClient()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mutation = useMutation({
    mutationFn: ({ id, ep_watched_count }: UpdateWatchedInput) =>
      updateDoc(doc(db, 'anime', id), { ep_watched_count }),
    onMutate: async ({ id, ep_watched_count }) => {
      await queryClient.cancelQueries({ queryKey: ['anime', userId] })

      const previousAnime = queryClient.getQueryData<AnimeItem[]>([
        'anime',
        userId,
      ])

      queryClient.setQueryData<AnimeItem[]>(['anime', userId], old =>
        old?.map(item =>
          item.id === id ? { ...item, ep_watched_count } : item,
        ),
      )

      return { previousAnime }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousAnime) {
        queryClient.setQueryData(['anime', userId], context.previousAnime)
      }
      toast.error('Не удалось обновить прогресс.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['anime', userId] })
    },
  })

  const debouncedMutate = (input: UpdateWatchedInput) => {
    queryClient.setQueryData<AnimeItem[]>(['anime', userId], old =>
      old?.map(item =>
        item.id === input.id
          ? { ...item, ep_watched_count: input.ep_watched_count }
          : item,
      ),
    )

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      mutation.mutate(input)
    }, 1000)
  }

  return { ...mutation, mutate: debouncedMutate }
}
