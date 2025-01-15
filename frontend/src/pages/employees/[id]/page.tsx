import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/apiHandlers';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteModal from '@/components/custom/DeleteModal';
import { IEmployee } from '@/models/employees';


export const Employee: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<IEmployee>();
    const [loading, setLoading] = useState(false);

    const AgentInfo = async () => {
        setLoading(true);
        const res = await getRequest({ url: `/users/${id}` });

        if (res.status === 200 || res.status === 201) {
            setData(res.data.data);
            setLoading(false);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при загрузке агента',
                variant: 'destructive',
            })
        }
    }

    useEffect(() => {
        AgentInfo();
    }, [id]);

    return (
        <div className='relative'>
            <div className='absolute -top-20 right-5 space-x-3'>
                <Button
                    variant={"custom"}
                    className='px-10'
                    onClick={() => navigate(`/agents/edit/${id}`)}
                >
                    Изменить
                </Button>
                <DeleteModal item={data} path="users" isPage={true}>
                    <Button
                        variant={"customOutline"}
                        className='px-10'
                    >
                        Удалить
                    </Button>
                </DeleteModal>
            </div>
            <Card className='w-full overflow-x-auto p-5 mb-5'>
                {loading ? (
                    <div className='max-w-[40%] space-y-2'>
                        <Skeleton className='aspect-square ' />
                        <Skeleton className='w-full h-11' />
                        <Skeleton className='w-full h-11' />
                        <Skeleton className='w-full h-11' />
                    </div>
                ) : (
                    <div className='flex gap-5'>
                        <div className='w-full max-w-[40%] space-y-3'>
                            <img src={data?.image || "/images/humanPlaceholder.png"} alt="agent image" className='aspect-square w-full object-cover border border-cLightGray rounded-lg' loading='lazy' />
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-gray-100'>
                                <h4 className='font-semibold text-base text-cDarkBlue'>Логин</h4>
                                <p className='text-cDarkBlue text-base'>{data?.username}</p>
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-gray-100'>
                                <h4 className='font-semibold text-base text-cDarkBlue'>Роль</h4>
                                <p className='text-cDarkBlue text-base'>{data?.role === "admin" ? "Администратор" : data?.role === "manager" ? "Менеджер" : "Продавец"}</p>
                            </div>
                        </div>
                        <div className='w-full max-w-[60%]'>
                            {/* <EmployeesHistory id={data?.id || ""} /> */}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
