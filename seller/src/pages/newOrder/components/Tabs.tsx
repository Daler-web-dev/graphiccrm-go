import { Skeleton } from '@/components/ui/skeleton';
import { useStateManager } from '@/contexts/useStateContext';
import { toast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/apiHandlers';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';

interface Props {
    className?: string;
}

export const EditorTabs: React.FC<Props> = ({ className }) => {
    const { tabs, setTabs, activeTabId, setActiveTabId, setFilteredProducts, loading, setLoading } = useStateManager()

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/categories` });
            if (res.status === 200 || res.status === 201) {
                setTabs(res.data.data);
                setLoading(false);
                setActiveTabId(res.data.data[0].id);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке видов деталей',
                    variant: 'destructive',
                });
            }
        };

        getCategories();
    }, []);

    useEffect(() => {
        const getFilteredByTabsProducts = async () => {
            if (!activeTabId) return
            const res = await getRequest({ url: `/products?category=${activeTabId}` });

            if (res.status === 200 || res.status === 201) {
                setFilteredProducts(res.data.data);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке продуктов',
                    variant: 'destructive',
                });
            }
        }

        getFilteredByTabsProducts();
    }, [activeTabId])

    return (
        <div className={cn('w-[350px] pt-2', className)}>
            <h2 className="font-semibold text-base mb-2">Детали</h2>
            {loading ? (
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-20 whitespace-nowrap" />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="flex gap-2 overflow-x-scroll">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTabId(tab.id)
                                }}
                                className={cn(
                                    'relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                                    activeTabId === tab.id
                                        ? 'text-cDarkBlue bg-gray-100 rounded-lg'
                                        : 'text-cLightBlue hover:text-cDarkBlue'
                                )}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
