import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
    className?: string;
    item: any
}

export const HistoryViewBlock: React.FC<Props> = ({ className, item }) => {
    return (
        <Card className={cn(className)}>
            <CardHeader className='p-4'>
                <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
                <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                    <p className='font-normal text-xl'>Цена</p>
                    <span className='font-semibold text-xl'>{item?.price}</span>
                </div>
                <div className='flex justify-between items-center p-3 rounded-2xl'>
                    <p className='font-normal text-xl'>Количество</p>
                    <span className='font-semibold text-xl'>{item?.quantity}</span>
                </div>
                <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                    <p className='font-normal text-xl'>Категория</p>
                    <span className='font-semibold text-xl'>{item?.category}</span>
                </div>
                <div className='flex justify-between items-center p-3 rounded-2xl'>
                    <p className='font-normal text-xl'>Материал</p>
                    <span className='font-semibold text-xl'>{item?.material}</span>
                </div>
                <div className='flex justify-center flex-col items-start text-left p-3 rounded-2xl bg-cWhite'>
                    <p className='font-normal text-xl'>Дополнительная информация</p>
                    <span className='font-normal text-base'>{item?.info}</span>
                </div>
            </CardContent>
        </Card>
    );
};