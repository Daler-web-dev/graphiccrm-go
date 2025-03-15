import DeleteModal from '@/components/custom/DeleteModal';
import { Button } from '@/components/ui/button';
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
                    <div className='w-[40%]'>
                        <img src={data?.image !== "" ? import.meta.env.VITE_API_URL + "/" + data?.image : "/images/humanPlaceholder.png"} alt="product image" className='object-cover rounded-3xl w-full aspect-square border border-gray-200 bg-[#F2F2F2]' />
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
                    <div className='w-[60%] flex flex-col gap-2'>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Имя</h4>
                            <p className='text-cDarkBlue text-base'>{data?.name}</p>
                        </div>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Стоимость</h4>
                            <p className='text-cDarkBlue text-base'>{formatPrice(data?.price || 0)}</p>
                        </div>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Кол-во на складе</h4>
                            <p className='text-cDarkBlue text-base'>{data?.amount || 0} шт.</p>
                        </div>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Сумма на складе</h4>
                            <p className='text-cDarkBlue text-base'>{formatPrice((data?.amount || 0) * (data?.price || 0))}</p>
                        </div>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Высота</h4>
                            <p className='text-cDarkBlue text-base'>{data?.height || 0} см.</p>
                        </div>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Ширина</h4>
                            <p className='text-cDarkBlue text-base'>{data?.width || 0} см.</p>
                        </div>
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg bg-[#F2F2F2]'>
                            <h4 className='font-semibold text-base text-cDarkBlue'>Единица измерения</h4>
                            <p className='text-cDarkBlue text-base'>{data?.unit === "piece" ? "В штуках" : "В сантиметрах"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};