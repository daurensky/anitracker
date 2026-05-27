
export function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('')
}

export function calcReleasedEpisodes(
  firstEpDate: string,
  releaseDay: number | null,
  totalEps: number,
): number {
  const first = new Date(firstEpDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  first.setHours(0, 0, 0, 0)

  if (first > today) return 0

  if (releaseDay === null) {
    const weeks = Math.floor(
      (today.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
    return Math.min(weeks + 1, totalEps)
  }

  const toJsDay = (d: number) => (d + 1) % 7

  const targetDay = toJsDay(releaseDay)
  const firstRelease = new Date(first)
  const diff = (targetDay - first.getDay() + 7) % 7
  firstRelease.setDate(firstRelease.getDate() + diff)

  if (firstRelease > today) return 0

  const weeks = Math.floor(
    (today.getTime() - firstRelease.getTime()) / (7 * 24 * 60 * 60 * 1000),
  )
  return Math.min(weeks + 1, totalEps)
}

export function calcDaysUntilRelease(releaseDayNum: number) {
  const today = new Date().getDay() // 0 = вс, 1 = пн ...
  return (releaseDayNum - today + 7) % 7
}
