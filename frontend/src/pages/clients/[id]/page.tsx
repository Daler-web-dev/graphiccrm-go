import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/apiHandlers';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteModal from '@/components/custom/DeleteModal';
import { ClientHistory } from '@/components/custom/ClientHistory';
import { IClient } from '@/types/clients';

export const Client: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<IClient>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ClientInfo = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/clients/${id}` });

            if (res.status === 200 || res.status === 201) {
                setData(res.data.data);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке информации о клиенте',
                    variant: 'destructive',
                })
            }
        }

        ClientInfo();
    }, [id]);

    return (
        <div className='relative'>
            <div className='space-x-3 absolute -top-16 right-0'>
                <Button
                    variant={"customOutline"}
                    className='px-10'
                    onClick={() => navigate(`/clients/edit/${id}`)}
                >
                    Изменить
                </Button>
                <DeleteModal item={data} path="clients" isPage={true}>
                    <Button
                        className='px-10'
                    >
                        Удалить
                    </Button>
                </DeleteModal>
            </div>
            <Card className='w-full overflow-x-auto p-5 mb-5'>
                {loading ? (
                    <div className='w-full flex gap-5 space-y-2'>
                        <Skeleton className='w-full max-w-[40%] aspect-square ' />
                        <div className='w-full space-y-3'>
                            <Skeleton className='w-full h-11' />
                            <Skeleton className='w-full h-11' />
                            <Skeleton className='w-full h-11' />
                            <Skeleton className='w-full h-11' />
                            <Skeleton className='w-full h-11' />
                            <Skeleton className='w-full h-11' />
                            <Skeleton className='w-full h-11' />
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-5'>
                        <div className='w-full flex gap-5'>
                            <img src={import.meta.env.VITE_API_URL + "/" + data?.image || "/images/humanPlaceholder.png"} alt="client image" className='aspect-square w-full max-w-[40%]  object-cover border border-cLightGray rounded-lg' loading='lazy' />
                            <div className='w-full'>
                                <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                    <h4 className='font-semibold text-base text-cDarkBlue'>Имя</h4>
                                    <p className='text-cDarkBlue text-base'>{data?.name}</p>
                                </div>
                                <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                    <h4 className='font-semibold text-base text-cDarkBlue'>Фамилия</h4>
                                    <p className='text-cDarkBlue text-base'>{data?.surname}</p>
                                </div>
                                <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                    <h4 className='font-semibold text-base text-cDarkBlue'>Номер телефона</h4>
                                    <p className='text-cDarkBlue text-base'>{data?.contactInfo}</p>
                                </div>
                                <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                    <h4 className='font-semibold text-base text-cDarkBlue'>Адрес</h4>
                                    <p className='text-cDarkBlue text-base'>{data?.address}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full'>
                            <ClientHistory data={data?.purchaseHistory} />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
