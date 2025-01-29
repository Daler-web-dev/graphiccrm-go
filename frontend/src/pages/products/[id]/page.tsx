import DeleteModal from '@/components/custom/DeleteModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { getRequest } from '@/lib/apiHandlers';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/models/products';
import { Edit, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const Product: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<IProduct>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/products/${id}` });

            if (res.status === 200 || res.status === 201) {
                setData(res.data.data);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке информации о товаре',
                    variant: 'destructive',
                })
                return
            }
        }

        fetchProduct();
    }, [id]);


    return (
        <div className='flex flex-col justify-center gap-5 relative'>
            {loading ? (
                <div className='flex gap-5'>
                    <Skeleton className='w-1/2 aspect-square' />
                    <div className='w-full flex flex-col gap-3'>
                        <Skeleton className='w-full h-14' />
                        <Skeleton className='w-full h-14' />
                        <Skeleton className='w-full h-14' />
                        <Skeleton className='w-full h-14' />
                        <Skeleton className='w-full h-14' />
                    </div>
                </div>
            ) : (
                <div className='flex justify-center items-start gap-5'>
                    <div className='w-[35%]'>
                        <img src={data?.image !== "" ? import.meta.env.VITE_API_URL + "/" + data?.image : "/images/humanPlaceholder.png"} alt="product image" className='object-cover rounded-3xl w-full aspect-square border border-gray-200' />
                        <div className='flex gap-3 absolute -top-24 right-5'>
                            <Button
                                variant={"customOutline"}
                                className='px-10 mt-5 w-full rounded-3xl'
                                onClick={() => navigate(`/products/edit/${id}`)}
                            >
                                <Edit className='mr-2' />
                                Редактировать
                            </Button>
                            <DeleteModal item={data} path='products' isPage={true}>
                                <Button
                                    variant={"custom"}
                                    className='px-10 mt-5 w-full rounded-3xl'
                                >
                                    <Trash2 className='mr-2' />
                                    Удалить
                                </Button>
                            </DeleteModal>
                        </div>
                    </div>
                    <Card className='text-cBlack rounded-3xl w-[65%]'>
                        <CardHeader>
                            <CardTitle>{data?.name || 'Название товара'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                                <p className='font-normal text-xl'>Категория</p>
                                <span className='font-semibold text-xl'>{data?.category?.name || 'Без категории'}</span>
                            </div>
                            <div className='flex justify-between items-center p-3 rounded-2xl'>
                                <p className='font-normal text-xl'>Стоимость</p>
                                <span className='font-semibold text-xl'>{formatPrice(data?.price || 0)}</span>
                            </div>
                            <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                                <p className='font-normal text-xl'>Ед. измерения</p>
                                <span className='font-semibold text-xl'>{data?.unit === 'piece' ? 'В штуках' : 'В сантиметрах'}</span>
                            </div>
                            <div className='flex justify-between items-center p-3 rounded-2xl'>
                                <p className='font-normal text-xl'>На складе</p>
                                <span className='font-semibold text-xl'>{data?.amount || 0} шт.</span>
                            </div>
                            {/* <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                                <p className='font-normal text-xl'>Произведено в месяц</p>
                                <span className='font-semibold text-xl'>{product?.producedLastMonth} шт.</span>
                            </div>
                            <div className='flex justify-between items-center p-3 rounded-2xl'>
                                <p className='font-normal text-xl'>Продано за месяц</p>
                                <span className='font-semibold text-xl'>{product?.soldLastMonth} шт.</span>
                            </div> */}
                            <div className='flex justify-between items-center p-3 rounded-2xl bg-cWhite'>
                                <p className='font-normal text-xl'>Высота</p>
                                <span className='font-semibold text-xl'>{data?.height || 0} м.</span>
                            </div>
                            <div className='flex justify-between items-center p-3 rounded-2xl'>
                                <p className='font-normal text-xl'>Ширина</p>
                                <span className='font-semibold text-xl'>{data?.width || 0} м.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};