import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/apiHandlers';
import { cn } from '@/lib/utils';
import { ICategory } from '@/models/categories';
import React, { useEffect, useState } from 'react';

interface Props {
    className?: string;
}

export const EditorTabs: React.FC<Props> = ({ className }) => {
    const [tabs, setTabs] = useState<ICategory[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/categories` });
            if (res.status === 200 || res.status === 201) {
                setTabs(res.data.data);
                setActiveTabId(res.data.data[0]?.id);
                setLoading(false)
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

    return (
        <div className={cn("pt-2", className)}>
            <h2 className="font-semibold text-base mb-2">Детали</h2>
            {loading ? (
                <div className="max-w-[400px] flex gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-20 whitespace-nowrap" />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="flex gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={cn(
                                    'relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                                    activeTabId === tab.id
                                        ? 'text-cDarkBlue after:content-[""] after:w-full after:h-px pb-2 after:bg-cLightBlue after:absolute after:bottom-0 after:left-0'
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
