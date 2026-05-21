import { create } from 'zustand'
import type { AnimeItem } from '~/types'

type AnimeDeleteStore = {
  isOpen: boolean
  anime: AnimeItem | null
  open: (anime: AnimeItem) => void
  close: () => void
}

export const useAnimeDeleteStore = create<AnimeDeleteStore>(set => ({
  isOpen: false,
  anime: null,
  open: anime => set({ anime, isOpen: true }),
  close: () => set({ isOpen: false }),
}))
