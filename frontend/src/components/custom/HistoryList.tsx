import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface Props {
    className?: string;
    data: any[]
    title: string
    description?: string
}

export const HistoryLIst: React.FC<Props> = ({ className, data, title, description }) => {
    const navigate = useNavigate()

    return (
        <Card className={cn(className)}>
            <CardHeader className='flex flex-col justify-center items-start'>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription className='text-cLightBlue'>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Номер</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Тип оплаты</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow className='text-left' onClick={() => navigate(`/history/${item.id}`)}>
                                <TableCell>{item.orderNumber}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.total}</TableCell>
                                <TableCell>{item.paymentType}</TableCell>
                                {item.status === 'Выполнен' ? <TableCell className='text-cDarkBlue'>{item.status}</TableCell> : item.status === 'В процессе' ? <TableCell className='text-cLightBlue'>{item.status}</TableCell> : <TableCell className='text-gray-400'>{item.status}</TableCell>}
                                <TableCell><Button>Просмотр</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};