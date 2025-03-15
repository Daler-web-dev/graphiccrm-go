import React from 'react';
import { cn, formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useNavigate } from 'react-router-dom';
import { IOrder } from '@/models/order';

interface Props {
    className?: string;
    data: IOrder[]
}

export const ClientHistory: React.FC<Props> = ({ className, data }) => {
    const navigate = useNavigate();

    return (
        <div className={cn(className)}>
            {data ? (
                <Table className='border-spacing-y-2 border-separate'>
                    <TableHeader>
                        <TableRow className="hover:bg-white border-none">
                            <TableHead>#</TableHead>
                            <TableHead>Номер</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Тип оплаты</TableHead>
                            <TableHead>Статус</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? data.map((item, index) => (
                            <TableRow className='bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none cursor-pointer text-left' key={index} onClick={() => navigate(`/orders/${item?.id}`)}>
                                <TableCell className='text-base rounded-s-xl relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{index + 1}</TableCell>
                                <TableCell className='text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{item?.id}</TableCell>
                                <TableCell className='text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{item?.createdAt.split('T')[0]}</TableCell>
                                <TableCell className='text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{formatPrice(item?.totalPrice)}</TableCell>
                                <TableCell className='text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{item?.paymentMethod === 'cash' ? 'Наличными' : item?.paymentMethod === "transfer" ? "Переводом" : "Картой"}</TableCell>
                                <TableCell
                                    className={cn('text-base text-left rounded-e-xl', item?.status === "delivered" ? "text-green-600" : item?.status === "in_production" ? "text-cDarkBlue" : item?.status === "pending" ? "text-gray-400" : item?.status === "accepted" ? "text-cLightBlue" : "text-red-600")}
                                >{item?.status === "delivered" ? "Доставлено" : item?.status === "in_production" ? "В производстве" : item?.status === "pending" ? "В ожидании" : item?.status === "ready" ? "Готово" : item?.status === "accepted" ? "Принято" : "Отклонено"}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell className="text-base text-center rounded-xl" colSpan={7}>
                                    Нет данных по вашему запросу
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div>
                    <Skeleton className='w-full h-[40vh]' />
                </div>
            )}
        </div>
    );
};