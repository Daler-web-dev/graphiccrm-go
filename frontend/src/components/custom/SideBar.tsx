import { LayoutGrid, Users, History, Building2, DollarSign, List, LogOut, SquareUser } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'
import clsx from 'clsx'

function SidebarLink({ href, icon: Icon, label, pathname }: { href: string; icon: React.ComponentType; label: string; pathname: string }) {
    const isActive = pathname === href

    return (
        <SidebarMenuItem>
            <SidebarMenuButton variant={"custom"} asChild tooltip={label}>
                <a
                    href={href}
                    className={clsx(
                        "flex items-center gap-3 py-3 px-3 rounded-md text-base font-normal",
                        isActive ? "bg-cGradientBg text-white shadow-md" : "text-cDarkBlue hover:bg-gray-100"
                    )}
                >
                    <Icon />
                    <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default function Component() {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r bg-white py-8">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold bg-cGradientBg bg-clip-text text-transparent group-data-[collapsible=icon]:hidden px-3.5">ЛОГО</div>
                    <h1 className="hidden text-3xl leading-6 font-bold bg-cGradientBg bg-clip-text text-transparent group-data-[collapsible=icon]:block">
                        <div className="flex flex-col items-start">
                            <span>ЛО</span>
                            <span>ГО</span>
                        </div>
                    </h1>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3.5 pt-20">
                <SidebarMenu>
                    <SidebarLink href="/" icon={LayoutGrid} label="Панель управления" pathname={pathname} />
                    <SidebarLink href="/users" icon={Users} label="Клиенты" pathname={pathname} />
                    <SidebarLink href="/history" icon={History} label="История" pathname={pathname} />
                    <SidebarLink href="/warehouse" icon={Building2} label="Склад" pathname={pathname} />
                    <SidebarLink href="/prices" icon={DollarSign} label="Цены" pathname={pathname} />
                    <SidebarLink href="/categories" icon={List} label="Категории" pathname={pathname} />
                    <SidebarLink href="/agents" icon={SquareUser} label="Агенты" pathname={pathname} />
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="mt-auto border-t px-4">
                <div className="space-y-2 group-data-[collapsible=icon]:hidden">
                    <h2 className="text-3xl font-medium">Имя Фамилия</h2>
                    <p className="text-xl text-muted-foreground">Разрешение/Статус</p>
                    <p className="text-sm text-muted-foreground">Ваш токен истечет через несколько дней</p>
                </div>
                <Button
                    variant={"ghost"}
                    onClick={() => {
                        navigate('/auth/signin')
                        toast({
                            title: "Выход из системы",
                            description: "Вы успешно вышли из системы",
                            variant: "default",
                        })
                    }}
                    className="text-[#FF3D3D] hover:text-[#ff5050] flex justify-start p-1"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Выход</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
