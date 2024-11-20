import { HistoryList } from '@/components/custom/HistoryList';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

export const History: React.FC = () => {
    const orders = [
        {
            id: 3245,
            orderNumber: 123456,
            date: '2022-10-01',
            total: 3000000,
            paymentType: 'Наличные',
            status: 'Выполнен'
        },
        {
            id: 2345,
            orderNumber: 1324567,
            date: '2022-01-11',
            total: 13220000,
            paymentType: 'Перевод',
            status: 'В процессе'
        },
        {
            id: 3124536,
            orderNumber: 756343,
            date: '2022-07-19',
            total: 6600000,
            paymentType: 'Долг',
            status: 'В ожидании'
        },
        {
            id: 123,
            orderNumber: 123456,
            date: '2022-10-01',
            total: 3000000,
            paymentType: 'Наличные',
            status: 'Выполнен'
        },
        {
            id: 456,
            orderNumber: 1324567,
            date: '2022-01-11',
            total: 13220000,
            paymentType: 'Перевод',
            status: 'В процессе'
        },
        {
            id: 789,
            orderNumber: 756343,
            date: '2022-07-19',
            total: 6600000,
            paymentType: 'Долг',
            status: 'В ожидании'
        },
        {
            id: 101,
            orderNumber: 123456,
            date: '2022-10-01',
            total: 3000000,
            paymentType: 'Наличные',
            status: 'Выполнен'
        },
        {
            id: 202,
            orderNumber: 1324567,
            date: '2022-01-11',
            total: 13220000,
            paymentType: 'Перевод',
            status: 'В процессе'
        },
        {
            id: 303,
            orderNumber: 756343,
            date: '2022-07-19',
            total: 6600000,
            paymentType: 'Долг',
            status: 'В ожидании'
        },
        {
            id: 404,
            orderNumber: 123456,
            date: '2022-10-01',
            total: 3000000,
            paymentType: 'Наличные',
            status: 'Выполнен'
        },
        {
            id: 505,
            orderNumber: 1324567,
            date: '2022-01-11',
            total: 13220000,
            paymentType: 'Перевод',
            status: 'В процессе'
        },
        {
            id: 606,
            orderNumber: 756343,
            date: '2022-07-19',
            total: 6600000,
            paymentType: 'Долг',
            status: 'В ожидании'
        }
    ]
    const debts = [
        {
            id: 707,
            orderNumber: 912345,
            date: '2022-02-22',
            total: 4200000,
            paymentType: 'Карта',
            status: 'Выполнен'
        },
        {
            id: 808,
            orderNumber: 456789,
            date: '2022-03-03',
            total: 5400000,
            paymentType: 'Наличные',
            status: 'В ожидании'
        },
        {
            id: 909,
            orderNumber: 135792,
            date: '2022-04-04',
            total: 2700000,
            paymentType: 'Перевод',
            status: 'В процессе'
        },
        {
            id: 1010,
            orderNumber: 246801,
            date: '2022-05-05',
            total: 8100000,
            paymentType: 'Долг',
            status: 'Выполнен'
        },
        {
            id: 1111,
            orderNumber: 357912,
            date: '2022-06-06',
            total: 9900000,
            paymentType: 'Карта',
            status: 'В ожидании'
        },
        {
            id: 1212,
            orderNumber: 467890,
            date: '2022-07-07',
            total: 6300000,
            paymentType: 'Наличные',
            status: 'В процессе'
        },
    ]
    return (
        <div className='relative'>
            <Tabs defaultValue="orders">
                <TabsList className='absolute -top-16 right-0'>
                    <TabsTrigger value="orders">Заказы</TabsTrigger>
                    <TabsTrigger value="debts">Долги</TabsTrigger>
                </TabsList>
                <TabsContent value="orders"><HistoryList title='История заказов' description='Здесь вы можете просмотреть историю заказов' data={orders} /></TabsContent>
                <TabsContent value="debts"><HistoryList title='История заказов' description='Здесь вы можете просмотреть историю заказов' data={debts} /></TabsContent>
            </Tabs>
            <Card className='w-full fixed bottom-0 right-5'>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Итого количество</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Итого сумма</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='text-left'>
                                <TableCell className='font-bold text-2xl'>{orders.length}</TableCell>
                                <TableCell className='font-bold text-2xl'>{orders.reduce((acc, order) => acc + order.total, 0)} сум</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};