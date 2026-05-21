import { create } from 'zustand'
import type { AnimeItem } from '~/types'

type AnimeEditStore = {
  isOpen: boolean
  anime: AnimeItem | null
  open: (anime: AnimeItem) => void
  close: () => void
}

export const useAnimeEditStore = create<AnimeEditStore>(set => ({
  isOpen: false,
  anime: null,
  open: anime => set({ anime, isOpen: true }),
  close: () => set({ isOpen: false }),
}))
