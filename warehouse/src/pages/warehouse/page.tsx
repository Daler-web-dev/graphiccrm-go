import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Warehouse: React.FC = () => {
    const navigate = useNavigate()

    const products = [
        {
            id: 1,
            title: "Товар 1",
            description: "Описание",
            price: 100000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 2,
            title: "Товар 2",
            description: "Описание",
            price: 200000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 3,
            title: "Товар 3",
            description: "Описание",
            price: 300000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 4,
            title: "Товар 4",
            description: "Описание",
            price: 400000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 5,
            title: "Товар 5",
            description: "Описание",
            price: 500000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 6,
            title: "Товар 6",
            description: "Описание",
            price: 600000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 7,
            title: "Товар 7",
            description: "Описание",
            price: 700000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 8,
            title: "Товар 8",
            description: "Описание",
            price: 800000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 9,
            title: "Товар 9",
            description: "Описание",
            price: 900000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 10,
            title: "Товар 10",
            description: "Описание",
            price: 1000000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        }
    ]

    return (
        <>
            <Card>
                <CardHeader className='flex justify-between items-center'>
                    <div className='w-full flex flex-col justify-start items-start gap-1'>
                        <CardTitle>Список товаров</CardTitle>
                        <CardDescription>Список товаров на складе</CardDescription>
                    </div>
                    <Input placeholder='Поиск...' className='max-w-[300px] px-10' />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Наименование</TableHead>
                                <TableHead>Цена</TableHead>
                                <TableHead>Продано за месяц</TableHead>
                                <TableHead>Произведено</TableHead>
                                <TableHead>Количество на складу</TableHead>
                                <TableHead>Товара на сумму</TableHead>
                                <TableHead>Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((item) => (
                                <TableRow className='text-left'>
                                    <TableCell className='flex gap-1 items-center'>
                                        <img src={item.image} alt="product image" loading='lazy' className='w-10 h-10 object-cover rounded-lg' />
                                        {item.title}
                                    </TableCell>
                                    <TableCell>{item.price} сум</TableCell>
                                    <TableCell>{item.soldLastMonth} штук</TableCell>
                                    <TableCell>{item.producedLastMonth} штук</TableCell>
                                    <TableCell>{item.overallLeft} штук</TableCell>
                                    <TableCell>{(item.price) * (item.overallLeft)} сум</TableCell>
                                    <TableCell className='flex gap-2'>
                                        <Button onClick={() => navigate(`/warehouse/${item.id}`)}>Просмотр</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className='w-full mt-5'>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className='hover:bg-transparent'>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Продано за месяц</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Произведено</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Итого на складе</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Итого сумма</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='text-left hover:bg-transparent'>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + order.soldLastMonth, 0)}</TableCell>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + order.producedLastMonth, 0)}</TableCell>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + order.overallLeft, 0)}</TableCell>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + (order.price * order.overallLeft), 0)} сум</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};