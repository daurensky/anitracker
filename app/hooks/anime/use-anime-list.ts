import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '~/firebase.client'
import { calcDaysUntilRelease, calcReleasedEpisodes } from '~/lib/utils'
import type { AnimeItem } from '~/types'

export type AnimeFilter = 'all' | 'watching' | 'completed' | 'releasing'

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
    case 'releasing':
      return list.filter(a => {
        const releasedEpCount = calcReleasedEpisodes(
          a.first_ep_date,
          a.ep_release_day,
          a.ep_total_count,
        )
        return releasedEpCount < a.ep_total_count
      })
    default:
      return list
  }
}

const sortByReleaseDay = (list: AnimeItem[]): AnimeItem[] => {
  return [...list].sort(
    (a, b) =>
      calcDaysUntilRelease(a.ep_release_day) -
      calcDaysUntilRelease(b.ep_release_day),
  )
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
      const searched = search.trim()
        ? filtered.filter(a =>
            a.name.toLowerCase().includes(search.toLowerCase().trim()),
          )
        : filtered

      return filter === 'releasing' ? sortByReleaseDay(searched) : searched
    },
    retry: 1,
  })
}
