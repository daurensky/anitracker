import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '~/firebase.client'
import type { AnimeItem } from '~/types'

const fetchAnimeList = async (userId: string): Promise<AnimeItem[]> => {
  const q = query(
    collection(db, 'anime'),
    where('userId', '==', userId),
    orderBy('created_at', 'desc'),
  )

  try {
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AnimeItem[]
  } catch (e) {
    console.error(e)
    throw e
  }
}

export function useAnimeList(userId: string) {
  return useQuery({
    queryKey: ['anime'],
    queryFn: () => fetchAnimeList(userId),
    retry: 1,
  })
}
