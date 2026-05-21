import { create } from 'zustand'

type AnimeCreateStore = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useAnimeCreateStore = create<AnimeCreateStore>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
