import { createContext, useContext } from 'react'

export interface StatsContextValues {
  anime: {
    total: number
    watching: number
    completed: number
  }
}

export const StatsContext = createContext<StatsContextValues | null>(null)

export function useStats() {
  return useContext(StatsContext)
}
