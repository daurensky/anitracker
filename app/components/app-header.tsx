import { IconLogout, IconPlus } from '@tabler/icons-react'
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
import AnimeForm from './anime-form'
import { useCreateAnime } from '~/hooks/anime/use-create-anime'
import { useAnimeCreateStore } from '~/store/use-anime-create-store'

type AppHeaderProps = {
  user: {
    name: string
    email: string
  }
  onLogoutClick: () => void
}

export default function AppHeader({ user, onLogoutClick }: AppHeaderProps) {
  const { open } = useAnimeCreateStore()

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
            <ul className="flex gap-2">
              <li className="text-sm">
                {0}{' '}
                <span className="text-muted-foreground text-xs">
                  всего тайтлов
                </span>
              </li>
              <li className="text-sm">
                {0}{' '}
                <span className="text-muted-foreground text-xs">смотрю</span>
              </li>
              <li className="text-sm">
                {0}{' '}
                <span className="text-muted-foreground text-xs">завершено</span>
              </li>
            </ul>

            <Separator orientation="vertical" className="mx-4" />

            <Button onClick={open}>
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
                  <AvatarFallback>{user.name}</AvatarFallback>
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
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
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
                <DropdownMenuItem onClick={onLogoutClick}>
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
