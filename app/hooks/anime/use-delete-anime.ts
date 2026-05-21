import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '~/firebase.client'
import { toast } from 'sonner'

export function useDeleteAnime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDoc(doc(db, 'anime', id)),
    onSuccess: () => {
      toast.success('Аниме удалено.')
      queryClient.invalidateQueries({ queryKey: ['anime'] })
    },
    onError: () => {
      toast.error('Не удалось удалить аниме.')
    },
  })
}
