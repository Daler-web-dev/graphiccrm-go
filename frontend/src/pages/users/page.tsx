import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Users: React.FC = () => {
    const navigate = useNavigate();

    const clients = [
        {
            id: 1,
            name: 'Иван Кузьма',
            contact: '+998979303666',
            address: 'Улугбек, сзади магазина',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            name: 'Алексей',
            contact: '+998907803666',
            address: 'Яшнабад, 1-й проезд, 8-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 3,
            name: 'Максим',
            contact: '+998977703666',
            address: 'Хамид Олимов, 31',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            name: 'Андрей',
            contact: '+998987703666',
            address: 'Юнусабад, 18-й квартал, 3-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 5,
            name: 'Артур',
            contact: '+998937703666',
            address: 'М.Улугбек, 32',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 6,
            name: 'Николай',
            contact: '+998917703666',
            address: 'Яшнабад, 2-й проезд, 12-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 7,
            name: 'Вадим',
            contact: '+998887703666',
            address: 'Хамза, 1-й проезд, 9-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 8,
            name: 'Константин',
            contact: '+998857703666',
            address: 'М.Улугбек, 56',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 9,
            name: 'Дмитрий',
            contact: '+998827703666',
            address: 'Юнусабад, 15-й квартал, 1-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 10,
            name: 'Александр',
            contact: '+998807703666',
            address: 'Яшнабад, 3-й проезд, 5-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 11,
            name: 'Сергей',
            contact: '+998787703666',
            address: 'Хамза, 2-й проезд, 11-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 12,
            name: 'Анна',
            contact: '+998767703666',
            address: 'М.Улугбек, 78',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 13,
            name: 'Владимир',
            contact: '+998747703666',
            address: 'Юнусабад, 12-й квартал, 7-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 14,
            name: 'Наталья',
            contact: '+998727703666',
            address: 'Яшнабад, 4-й проезд, 10-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 15,
            name: 'Елена',
            contact: '+998707703666',
            address: 'Хамза, 3-й проезд, 14-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 16,
            name: 'Олег',
            contact: '+998687703666',
            address: 'М.Улугбек, 92',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 17,
            name: 'Татьяна',
            contact: '+998667703666',
            address: 'Юнусабад, 16-й квартал, 3-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 18,
            name: 'Светлана',
            contact: '+998647703666',
            address: 'Яшнабад, 5-й проезд, 12-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 19,
            name: 'Виктор',
            contact: '+998627703666',
            address: 'Хамза, 4-й проезд, 15-й дом',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 20,
            name: 'Мария',
            contact: '+998607703666',
            address: 'М.Улугбек, 106',
            image: "https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]

    return (
        <Card>
            <CardHeader className='flex justify-between items-center'>
                <div className='w-full flex flex-col justify-start items-start gap-1'>
                    <CardTitle>Список клиентов</CardTitle>
                    <CardDescription>Список активных клиентов</CardDescription>
                </div>
                <Input placeholder='Поиск...' className='max-w-[300px] px-10' />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Имя</TableHead>
                            <TableHead>Контакт</TableHead>
                            <TableHead>Адрес</TableHead>
                            <TableHead>Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow className='text-left'>
                                <TableCell className='flex gap-1 justify-start items-center'>
                                    <img src={client.image} alt="client image" loading='lazy' className='w-10 h-10 object-cover rounded-lg' />
                                    {client.name}
                                </TableCell>
                                <TableCell>{client.contact}</TableCell>
                                <TableCell>{client.address}</TableCell>
                                <TableCell className='flex gap-2'>
                                    <Button onClick={() => navigate(`/users/${client.id}`)}>Просмотр</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};