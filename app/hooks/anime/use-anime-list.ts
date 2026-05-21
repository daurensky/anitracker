import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '~/firebase.client'
import type { AnimeItem } from './types'

const fetchAnimeList = async (): Promise<AnimeItem[]> => {
  const q = query(collection(db, 'anime'), orderBy('created_at', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as AnimeItem[]
}

export function useAnimeList() {
  return useQuery({
    queryKey: ['anime'],
    queryFn: fetchAnimeList,
  })
}
