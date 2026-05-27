import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '~/firebase.client'
import type { AnimeItem } from '~/types'

export type AnimeFilter = 'all' | 'watching' | 'completed'

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

const filterAnime = (list: AnimeItem[], filter: AnimeFilter): AnimeItem[] => {
  switch (filter) {
    case 'watching':
      return list.filter(a => a.ep_watched_count < a.ep_total_count)
    case 'completed':
      return list.filter(a => a.ep_watched_count >= a.ep_total_count)
    default:
      return list
  }
}

export function useAnimeList(
  userId: string,
  filter: AnimeFilter = 'all',
  search = '',
) {
  return useQuery({
    queryKey: ['anime', userId],
    queryFn: () => fetchAnimeList(userId),
    select: data => {
      const filtered = filterAnime(data, filter)
      if (!search.trim()) return filtered
      const q = search.toLowerCase().trim()
      return filtered.filter(a => a.name.toLowerCase().includes(q))
    },
    retry: 1,
  })
}
