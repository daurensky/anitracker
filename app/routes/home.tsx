import type { Route } from './+types/home'
import AnimeListSection from './anime/anime-list-section'
import UpcomingAnimeSection from './anime/upcoming-anime-section'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'AniTracker' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <main className="space-y-6">
      <UpcomingAnimeSection />
      <AnimeListSection />
    </main>
  )
}
