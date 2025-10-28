import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    Menu, 
    Home,
    Building2,
    LayoutTemplate,
    Users,
    ImageIcon,
    Calendar,
    HardHat,
    Settings,
    FileText,
    Shield,
} from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';


const mainNavItems: NavItem[] = [
    {
        title: 'Home Page',
        href: '/admin/home',
        icon: Home,
    },
    {
        title: 'Properties',
        href: '/admin/properties',
        icon: Building2,
    },
    {
        title: 'Communities',
        href: '/admin/communities',
        icon: Users,
    },
    // {
    //     title: 'Floor Plans',
    //     href: '/admin/floor-plans',
    //     icon: LayoutTemplate,
    // },
    {
        title: 'Services',
        href: '/admin/services',
        icon: LayoutTemplate,
    },
    {
        title: 'Gallery',
        href: '/admin/gallery-albums',
        icon: ImageIcon,
    },
    {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
    },
    {
        title: 'Team',
        href: '/admin/team-members',
        icon: Users,
    },
    {
        title: 'Building Options',
        href: '/admin/building-options',
        icon: HardHat,
    },
];


const settingsNavItems: NavItem[] = [
    {
        title: 'Layout & Settings',
        href: '/admin/layout',
        icon: Settings,
    },
    {
        title: 'About Us',
        href: '/admin/about-us',
        icon: FileText,
    },
    {
        title: 'Privacy Policy',
        href: '/admin/privacy-policy',
        icon: Shield,
    },
];


const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';


interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}


export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar overflow-y-auto"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-6 p-4">
                                    <div className="flex flex-col space-y-4">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                                            Main Menu
                                        </p>
                                        {mainNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
                                                    isSameUrl(page.url, item.href) && "bg-accent"
                                                )}
                                            >
                                                {item.icon && (
                                                    <Icon
                                                        iconNode={item.icon}
                                                        className="h-5 w-5"
                                                    />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="flex flex-col space-y-4">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                                            Settings
                                        </p>
                                        {settingsNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
                                                    isSameUrl(page.url, item.href) && "bg-accent"
                                                )}
                                            >
                                                {item.icon && (
                                                    <Icon
                                                        iconNode={item.icon}
                                                        className="h-5 w-5"
                                                    />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href='/admin/home'
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-2 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-1">
                                {mainNavItems.slice(0, 6).map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                isSameUrl(
                                                    page.url,
                                                    item.href,
                                                ) && activeItemStyles,
                                                'h-9 cursor-pointer px-3 text-sm',
                                            )}
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="mr-2 h-4 w-4"
                                                />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isSameUrl(page.url, item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                                
                                {/* More Dropdown for remaining items */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-9 px-3 text-sm font-medium"
                                            >
                                                More
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            {mainNavItems.slice(6).map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
                                                        isSameUrl(page.url, item.href) && "bg-accent"
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="h-4 w-4"
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                            <div className="my-1 h-px bg-border" />
                                            {settingsNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
                                                        isSameUrl(page.url, item.href) && "bg-accent"
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="h-4 w-4"
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
