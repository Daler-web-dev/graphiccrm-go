import React from 'react';
import { Skeleton } from '../ui/skeleton';

export const LoaderTable: React.FC = () => {
    return (
        <div className='flex flex-col gap-2'>
            {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
            ))}
        </div>
    );
};