import { HistoryViewBlock } from '@/components/custom/HistoryViewBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
// import { useParams } from 'react-router-dom';

export const HistoryView: React.FC = () => {
    // const { id } = useParams();
    const item = {
        id: 3245,
        orderNumber: 123456,
        client: {
            name: 'Иван Кузьма',
            contact: '+998979303666',
            address: 'Улугбек, сзади магазина',
        },
        date: '2022-10-01',
        total: 3000000,
        paymentType: 'Наличные',
        status: 'Выполнен',
        list: [
            {
                id: 1,
                name: 'Товар 1',
                price: 1000000,
                quantity: 1,
                category: 'Категория 1',
                material: 'Материал 1',
                info: 'Дополнительная информация 1'
            },
            {
                id: 2,
                name: 'Товар 2',
                price: 2000000,
                quantity: 2,
                category: 'Категория 2',
                material: 'Материал 2',
                info: 'Дополнительная информация 2'
            },
            {
                id: 3,
                name: 'Товар 3',
                price: 1500000,
                quantity: 3,
                category: 'Категория 3',
                material: 'Материал 3',
                info: 'Дополнительная информация 3'
            },
            {
                id: 4,
                name: 'Товар 4',
                price: 2500000,
                quantity: 4,
                category: 'Категория 4',
                material: 'Материал 4',
                info: 'Дополнительная информация 4'
            },
            {
                id: 5,
                name: 'Товар 5',
                price: 3000000,
                quantity: 5,
                category: 'Категория 5',
                material: 'Материал 5',
                info: 'Дополнительная информация 5'
            },
            {
                id: 6,
                name: 'Товар 6',
                price: 3500000,
                quantity: 6,
                category: 'Категория 6',
                material: 'Материал 6',
                info: 'Дополнительная информация 6'
            }
        ]
    }

    return (
        <Card>
            <CardHeader className='flex justify-between items-start gap-5'>
                <div className='flex flex-col justify-center text-left items-start'>
                    <CardTitle className='font-semibold text-xl text-cBlack'>Номер заказа:</CardTitle>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.orderNumber}</CardDescription>
                </div>
                <div className='flex flex-col justify-center text-left items-start'>
                    <CardTitle className='font-semibold text-xl text-cBlack'>Клиент:</CardTitle>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.client.name}</CardDescription>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.client.address}</CardDescription>
                </div>
                <div className='flex flex-col justify-center text-left items-start'>
                    <CardTitle className='font-semibold text-xl text-cBlack'>Дата:</CardTitle>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.date}</CardDescription>
                </div>
                <div className='flex flex-col justify-center text-left items-start'>
                    <CardTitle className='font-semibold text-xl text-cBlack'>Сумма:</CardTitle>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.total}</CardDescription>
                </div>
                <div className='flex flex-col justify-center text-left items-start'>
                    <CardTitle className='font-semibold text-xl text-cBlack'>Тип оплаты:</CardTitle>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.paymentType}</CardDescription>
                </div>
                <div className='flex flex-col justify-center text-left items-start'>
                    <CardTitle className='font-semibold text-xl text-cBlack'>Статус:</CardTitle>
                    <CardDescription className='font-medium text-cLightBlue text-base'>{item.status}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-5'>
                {item.list.map((item) => (<HistoryViewBlock key={item.id} item={item} />))}
            </CardContent>
        </Card>
    );
};