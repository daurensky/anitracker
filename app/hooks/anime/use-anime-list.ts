import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '~/firebase.client'
import type { AnimeItem } from '~/types'

const fetchAnimeList = async (): Promise<AnimeItem[]> => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) return []

  const q = query(
    collection(db, 'anime'),
    where('userId', '==', user.uid),
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

export function useAnimeList() {
  return useQuery({
    queryKey: ['anime'],
    queryFn: fetchAnimeList,
    retry: 1,
  })
}
