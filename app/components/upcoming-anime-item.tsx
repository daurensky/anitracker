import { Link } from 'react-router'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from './ui/item'
import { WEEKDAYS } from '~/constants'
import { Badge } from './ui/badge'
import { calcDaysUntilRelease, calcReleasedEpisodes } from '~/lib/anime'

type UpcomingAnimeItemProps = {
  coverUrl: string
  animeName: string
  epCount: number
  watchUrl: string
  firstEpDate: string
  releaseDayNum: number
} & React.ComponentProps<'div'>

export default function UpcomingAnimeItem({
  coverUrl,
  animeName,
  epCount,
  watchUrl,
  firstEpDate,
  releaseDayNum,
  ...props
}: UpcomingAnimeItemProps) {
  const releasedEpCount = calcReleasedEpisodes(
    firstEpDate,
    releaseDayNum,
    epCount,
  )
  const daysUntil = calcDaysUntilRelease(releaseDayNum)

  return (
    <Item variant="outline" asChild role="listitem" {...props}>
      <Link to={watchUrl} target="_blank" rel="noopener noreferrer">
        <ItemMedia variant="image" className="size-15">
          <img src={coverUrl} alt="" className="object-cover" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{animeName}</ItemTitle>
          <ItemDescription>
            <span className="text-primary text-xs dark:text-primary-foreground">
              {WEEKDAYS[releaseDayNum]}
            </span>
            <br />
            <span className="text-xs">
              {releasedEpCount}/{epCount} эп.
            </span>
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription>
            {daysUntil === 0 ? (
              <Badge className="bg-green-700 text-green-50 dark:bg-green-500 dark:text-green-950">
                Сегодня
              </Badge>
            ) : daysUntil === 1 ? (
              <Badge variant="secondary">Завтра</Badge>
            ) : (
              <Badge variant="secondary">{daysUntil} дн.</Badge>
            )}
          </ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  )
}
