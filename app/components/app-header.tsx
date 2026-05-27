import { IconLogout, IconPlus } from '@tabler/icons-react'
import { useCreateAnimeModal } from '~/context/anime-context'
import { useAuthenticated } from '~/context/auth-context'
import { useStats } from '~/context/stats-context'
import { getInitials } from '~/lib/anime'
import AppLogo from './app-logo'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export default function AppHeader() {
  const { user, logout } = useAuthenticated()
  const stats = useStats()
  const { openModal } = useCreateAnimeModal()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 py-4 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <AppLogo />

          <Separator orientation="vertical" className="mx-4" />

          <ModeToggle />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center">
            {stats && (
              <>
                <ul className="flex gap-2">
                  <li className="text-sm">
                    {stats.anime.total}{' '}
                    <span className="text-muted-foreground text-xs">всего</span>
                  </li>
                  <li className="text-sm">
                    {stats.anime.watching}{' '}
                    <span className="text-muted-foreground text-xs">
                      смотрю
                    </span>
                  </li>
                  <li className="text-sm">
                    {stats.anime.completed}{' '}
                    <span className="text-muted-foreground text-xs">
                      завершено
                    </span>
                  </li>
                </ul>
                <Separator orientation="vertical" className="mx-4" />
              </>
            )}

            <Button onClick={openModal}>
              <IconPlus />
              Добавить
            </Button>

            <Separator orientation="vertical" className="mx-4" />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    // src="https://github.com/shadcn.png"
                    // alt="@shadcn"
                    className="grayscale"
                  />
                  {user.displayName && (
                    <AvatarFallback>
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        // src="https://github.com/shadcn.png"
                        // alt="@shadcn"
                        className="grayscale"
                      />
                      {user.displayName && (
                        <AvatarFallback>
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user.displayName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconUserCircle />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconNotification />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={logout}>
                  <IconLogout />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
