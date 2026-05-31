import { IconAlertCircle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
import { Headline } from '~/components/ui/headline'
import { Skeleton } from '~/components/ui/skeleton'
import UpcomingAnimeItem from '~/components/upcoming-anime-item'
import { useAuthenticated } from '~/context/auth-context'
import { useAnimeList } from '~/hooks/anime/use-anime-list'

export default function UpcomingAnimeSection() {
  const { user } = useAuthenticated()
  const { data: animeList, status } = useAnimeList(user.uid, 'releasing')

  return (
    <section>
      <div className="container mx-auto space-y-4">
        <Headline>Скоро выходят</Headline>

        {status === 'pending' ? (
          <div className="flex gap-4">
            <Skeleton className="w-full h-[93px]" />
            <Skeleton className="w-full h-[93px]" />
            <Skeleton className="w-full h-[93px]" />
            <Skeleton className="w-full h-[93px]" />
          </div>
        ) : status === 'error' ? (
          <Alert variant="destructive" className="max-w-md">
            <IconAlertCircle />
            <AlertTitle>Что-то пошло не так</AlertTitle>
            <AlertDescription>
              Не удалось загрузить предстоящие аниме из-за ошибки. Повторите
              попытку позже
            </AlertDescription>
          </Alert>
        ) : animeList.length > 0 ? (
          <Carousel opts={{ slidesToScroll: 3 }} className="w-full">
            <CarouselContent>
              {animeList.map(anime => (
                <CarouselItem key={anime.id} className="basis-1/4">
                  <UpcomingAnimeItem
                    coverUrl={anime.cover_url}
                    animeName={anime.name}
                    epCount={anime.ep_total_count}
                    watchUrl={anime.watch_url}
                    firstEpDate={anime.first_ep_date}
                    releaseDayNum={anime.ep_release_day}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {animeList.length > 3 && (
              <>
                <CarouselNext />
                <CarouselPrevious />
              </>
            )}
          </Carousel>
        ) : (
          <p className="text-xs text-muted-foreground">
            Нет активных аниме с расписанием
          </p>
        )}
      </div>
    </section>
  )
}
