import ConfirmModal from '@/components/custom/ConfirmModal';
import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { getRequest, patchRequest } from '@/lib/apiHandlers';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

interface IProduct {
    id: string;
    name: string;
    articul: string;
    unitPrice: number;
    count: number;
    amountInBox: number;
    categoryId: string;
    imagePath: string;
}


export const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<IProduct>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IProduct | null>(null);
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/product/${id}` });

            if (res.status === 200 || res.status === 201) {
                const { name, articul, unitPrice, count, amountInBox, categoryId, imagePath } = res.data;
                reset({ name, articul, unitPrice, count, amountInBox, categoryId, imagePath });
                setData(res.data);
                setValue('imagePath', imagePath);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные товара',
                    variant: 'destructive',
                });
                return
            }

            const getCategories = await getRequest({ url: '/category' });
            if (getCategories.status === 200 || getCategories.status === 201) {
                setCategories(getCategories.data.data);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить категории товара',
                    variant: 'destructive',
                });
                return
            }
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        const resData = { ...data, count: Number(data.count), amountInBox: Number(data.amountInBox), unitPrice: Number(data.unitPrice) }
        const response = await patchRequest({
            url: `/product/${id}`,
            data: resData,
        });

        if (response.status === 200 || response.status === 201) {
            toast({
                title: 'Успех',
                description: 'Данные товара успешно обновлены',
            });
            reset(data);
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить данные товара',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className='relative'>
            <Card className='w-full overflow-x-auto p-5 mb-5'>
                {loading ? (
                    <div className='flex gap-5 relative'>
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
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5">
                        <div className='w-1/2 aspect-square border border-cLightGray rounded-lg'>
                            <ImageUploader
                                previewPlaceholder={`${data?.imagePath}`}
                                onUploadSuccess={(url: string) => {
                                    setValue('imagePath', url, { shouldDirty: true });
                                }}
                            />
                        </div>
                        <div className="w-full space-y-3">
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='name' className="text-base font-semibold text-cDarkBlue cursor-pointer">Наименование</label>
                                <input
                                    id='name'
                                    type="text"
                                    {...register('name', { required: 'Наименование обязательно' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Наименование'
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='articul' className="text-base font-semibold text-cDarkBlue cursor-pointer">Артикул</label>
                                <input
                                    id='articul'
                                    type="text"
                                    {...register('articul', { required: 'Артикул обязателен' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Артикул'
                                />
                                {errors.articul && <p className="text-red-500 text-sm">{errors.articul.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='amountInBox' className="text-base font-semibold text-cDarkBlue cursor-pointer">Кол-во в коробке</label>
                                <input
                                    id='amountInBox'
                                    type="text"
                                    {...register('amountInBox', { required: 'Кол-во в коробке обязателен' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Кол-во в коробке'
                                />
                                {errors.amountInBox && <p className="text-red-500 text-sm">{errors.amountInBox.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='unitPrice' className="text-base font-semibold text-cDarkBlue cursor-pointer">Цена</label>
                                <input
                                    id='unitPrice'
                                    type="text"
                                    {...register('unitPrice', { required: 'Цена обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Цена'
                                />
                                {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='count' className="text-base font-semibold text-cDarkBlue cursor-pointer">Кол-во на складе</label>
                                <input
                                    id='count'
                                    type="text"
                                    {...register('count', { required: 'Кол-во на складе обязателен' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Кол-во на складе'
                                />
                                {errors.count && <p className="text-red-500 text-sm">{errors.count.message}</p>}
                            </div>
                            {
                                loading ? (
                                    <Skeleton className="w-full h-16" />
                                ) : (
                                    <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                        <label htmlFor='categoryId' className="text-base font-semibold text-cDarkBlue cursor-pointer">Категория</label>
                                        <select
                                            id='categoryId'
                                            {...register('categoryId', { required: 'Цена обязательна' })}
                                            className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                        >
                                            <option value="" disabled selected hidden className="text-base font-semibold text-cDarkBlue">Выберите категорию</option>
                                            {categories && categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                                    </div>
                                )
                            }
                        </div>

                        <div className='flex gap-3 absolute top-5 right-5'>
                            <ConfirmModal title='Вы действительно хотите отменить изменения агента?' setState={(state: boolean) => {
                                state && navigate(-1) && reset();
                            }}>
                                <Button variant={'customOutline'} type="button" className="px-10">Отменить</Button>
                            </ConfirmModal>
                            <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? 'Загрузка...' : 'Сохранить клиента'}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div >
    );
};