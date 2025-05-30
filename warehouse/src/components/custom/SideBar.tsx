import { useNavigate } from 'react-router-dom'
import { History, Building2, LogOut } from 'lucide-react'
import Cookies from 'js-cookie';
import ConfirmModal from './ConfirmModal';
import { toast } from '@/hooks/use-toast';

const SidebarItem = ({ href, icon: Icon, label, isActive }: { href: string; icon: React.ComponentType; label: string; isActive: boolean }) => {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(href)}
            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            <Icon />
            <span className='text-base font-normal'>{label}</span>
        </div>
    )
}

export default function Sidebar() {
    const navigate = useNavigate()
    const currentPath = window.location.pathname

    return (
        <div className="w-64 fixed top-5 bottom-5 bg-white border rounded-lg flex flex-col">
            <div className="text-4xl font-bold bg-cGradientBg bg-clip-text text-transparent py-5 text-start px-3.5">Графичекий редактор</div>

            <nav className="flex-1 px-4 py-6 space-y-2 select-none">
                {/* <SidebarItem href="/" icon={LayoutGrid} label="Панель управления" isActive={currentPath === '/'} /> */}
                <SidebarItem href="/orders" icon={History} label="История" isActive={currentPath === '/warehouse/orders'} />
                <SidebarItem href="/products" icon={Building2} label="Склад" isActive={currentPath === '/warehouse/products'} />
            </nav>

            <div className="px-4 border-t py-4 select-none">
                <ConfirmModal title='Вы действительно хотите выйти?' setState={(state: boolean) => {
                    if (state) {
                        Cookies.remove('accessToken')
                        navigate('/auth/signin')
                        toast({
                            title: 'Выход',
                            description: 'Вы успешно вышли из системы',
                        })
                    }
                }}>
                    <button
                        className="flex items-center text-red-500 hover:text-red-600"
                    >
                        <LogOut />
                        <span className="ml-2">Выход</span>
                    </button>
                </ConfirmModal>
            </div>
        </div>
    )
}
