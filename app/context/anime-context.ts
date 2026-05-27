import { createContext, useContext } from 'react'

interface AnimeCreateContextValues {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const AnimeCreateContext = createContext<AnimeCreateContextValues>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
})
export function useCreateAnimeContext() {
  return useContext(AnimeCreateContext)
}
