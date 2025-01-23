import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    className?: string;
    data: any
}

export const ClientHistory: React.FC<Props> = ({ className, data }) => {
    return (
        <div className={cn(className)}>
            {data ? (
                <div>Data exists</div>
            ) : (
                <div>
                    <Skeleton className='w-full h-[40vh]' />
                </div>
            )}
        </div>
    );
};