import { LoaderTable } from '@/components/custom/LoaderTable';
import Pagination from '@/components/custom/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/apiHandlers';
import { formatPrice } from '@/lib/utils';
import { IClient } from '@/types/clients';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Clients: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Array<IClient>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const loadPageData = async (page: number) => {
        setLoading(true);
        const res = await getRequest({ url: `/clients?page=${page}&limit=10` });
        console.log(res);

        if (res.status === 200 || res.status === 201) {
            setData(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            setLoading(false);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при загрузке клиентов',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        loadPageData(currentPage);
    }, [currentPage]);

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
                {loading ? (
                    <LoaderTable />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Имя</TableHead>
                                    <TableHead>Контакт</TableHead>
                                    <TableHead>Адрес</TableHead>
                                    <TableHead>Общий долг</TableHead>
                                    <TableHead>Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length > 0 ? data.map((client, idx) => (
                                    <TableRow className='text-left'>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell className='flex gap-1 justify-start items-center'>
                                            {/* <img src={client.image} alt="client image" loading='lazy' className='w-10 h-10 object-cover rounded-lg' /> */}
                                            {client.name}
                                        </TableCell>
                                        <TableCell>{client.contactInfo}</TableCell>
                                        <TableCell>{client.address}</TableCell>
                                        <TableCell>{formatPrice(client.balance)}</TableCell>
                                        <TableCell className='flex gap-2'>
                                            <Button onClick={() => navigate(`/users/${client.id}`)}>Просмотр</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell className="text-base text-center rounded-xl" colSpan={4}>
                                            Нет данных по вашему запросу
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
};