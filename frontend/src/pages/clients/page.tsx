import { LoaderTable } from '@/components/custom/LoaderTable';
import Pagination from '@/components/custom/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { getRequest } from '@/lib/apiHandlers';
import { formatPrice } from '@/lib/utils';
import { IClient } from '@/models/clients';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Clients: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Array<IClient>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<string>('');
    const searchDebounced = useDebounce(search, 500);


    const loadPageData = async (page: number, search: string) => {
        setLoading(true);

        if (search === '') {
            const res = await getRequest({ url: `/clients?page=${page}&limit=10` });

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
        } else {
            const res = await getRequest({ url: `/clients/search?q=${search}` });

            if (res.status === 200 || res.status === 201) {
                setData(res.data.data);
                setTotalPages(1);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке клиентов',
                    variant: 'destructive',
                });
            }
        }
    };

    useEffect(() => {
        loadPageData(currentPage, searchDebounced);
    }, [currentPage, searchDebounced]);

    const getClientList = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exports/clients`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    },
                }
            );

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Failed to download PDF");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            // Создаем скрытую ссылку для скачивания
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `clients_list.XLSX`);
            document.body.appendChild(link);

            // Имитируем клик
            link.click();

            // Убираем ссылку и освобождаем память
            link.parentNode!.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error: any) {
            // toast.error(`Ошибка: ${error.message}`);
            console.error("PDF download error:", error);
        }
    }

    return (
        <Card>
            <div className='relative'>
                <Button
                    variant={"customOutline"}
                    className='absolute right-[235px] -top-20 px-10'
                    onClick={getClientList}
                >
                    Получить список клиентов
                </Button>
                <Button
                    className='absolute right-5 -top-20 px-10'
                    onClick={() => {
                        navigate('/clients/new');
                    }}
                >Добавить клиента</Button>
            </div>
            <CardHeader className='flex justify-between items-center'>
                <div className='w-full flex flex-col justify-start items-start gap-1'>
                    <CardTitle>Список клиентов</CardTitle>
                    <CardDescription>Список активных клиентов</CardDescription>
                </div>
                <Input
                    placeholder='Поиск...'
                    className='max-w-[300px] p-2'
                    onChange={(e) => setSearch(e.target.value)}
                />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <LoaderTable />
                ) : (
                    <>
                        <Table className='border-spacing-y-2 border-separate'>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-white">
                                    <TableHead className='text-left text-base font-semibold'>#</TableHead>
                                    <TableHead className='text-left text-base font-semibold'>Имя</TableHead>
                                    <TableHead className='text-left text-base font-semibold'>Контакт</TableHead>
                                    <TableHead className='text-left text-base font-semibold'>Адрес</TableHead>
                                    <TableHead className='text-left text-base font-semibold'>Общий долг</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data && data.length > 0 ? data.map((client, idx) => (
                                    <TableRow className='bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none cursor-pointer' key={idx} onClick={() => navigate(`/clients/${client.id}`)}>
                                        <TableCell className='text-base rounded-s-xl relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{idx + 1}</TableCell>
                                        <TableCell className='flex gap-1 justify-start items-center text-base rounded-s-xl relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>
                                            {client.name} {client.surname}
                                        </TableCell>
                                        <TableCell className='text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{client.contactInfo}</TableCell>
                                        <TableCell className='text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{client.address}</TableCell>
                                        <TableCell className='text-base text-left rounded-e-xl'>{formatPrice(client.balance)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell className="text-base text-center rounded-xl" colSpan={6}>
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