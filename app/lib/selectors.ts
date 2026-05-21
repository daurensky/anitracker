import type { AnimeItem } from '~/types'

export const selectComingSoon = (list: AnimeItem[], withinDays = 30) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const limit = new Date(today)
  limit.setDate(today.getDate() + withinDays)

  return list
    .filter(a => {
      const date = new Date(a.first_ep_date)
      return date > today && date <= limit
    })
    .sort(
      (a, b) =>
        new Date(a.first_ep_date).getTime() -
        new Date(b.first_ep_date).getTime(),
    )
}
