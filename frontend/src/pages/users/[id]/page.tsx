import { HistoryList } from '@/components/custom/HistoryList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

export const User: React.FC = () => {
    // const { id } = useParams();
    const client = {
        id: 1,
        name: 'Иван Кузьма',
        contact: '+998979303666',
        address: 'Улугбек, сзади магазина',
        info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, fugit. Consequuntur culpa dignissimos qui repellendus recusandae sequi, cupiditate iusto consequatur voluptatum? Repellendus, necessitatibus doloremque! Nisi culpa repellat reiciendis ducimus fugiat!",
        image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        history: [
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
        ]
    }

    return (
        <div className='relative flex flex-col justify-center gap-5'>
            <Button className='absolute -top-16 right-0 px-10'>Заказ</Button>
            <div className='flex justify-center items-start gap-5'>
                <img src={client.image} alt="client image" className='object-cover rounded-3xl w-[35%] aspect-square' />
                <Card className='text-cBlack rounded-3xl w-[65%]'>
                    <CardHeader className='flex justify-between items-center'>
                        <CardTitle>{client.name}</CardTitle>
                        <div className='flex gap-2'>
                            <Edit width={24} height={24} className='text-cDarkBlue cursor-pointer' />
                            <Trash2 width={24} height={24} className='text-red-600 cursor-pointer' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                            <p className='font-normal text-xl'>Адрес</p>
                            <span className='font-semibold text-xl'>{client?.address}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <p className='font-normal text-xl'>Контакт</p>
                            <span className='font-semibold text-xl'>{client?.contact}</span>
                        </div>
                        <div className='flex justify-center flex-col items-start text-left p-3 rounded-2xl bg-cWhite'>
                            <p className='font-normal text-xl'>Дополнительная информация</p>
                            <span className='font-normal text-base'>{client?.info}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <HistoryList title='История' data={client.history} />
        </div>
    );
};