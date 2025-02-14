import ConfirmModal from '@/components/custom/ConfirmModal';
import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { getRequest, patchRequest } from '@/lib/apiHandlers';
import { IProduct } from '@/models/products';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<IProduct>({ mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IProduct | null>(null);
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/products/${id}` });

            if (res.status === 200 || res.status === 201) {
                reset({ ...res.data.data });
                setData(res.data.data);
                setValue('image', res.data.data.image);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные товара',
                    variant: 'destructive',
                });
                return
            }

            const getCategories = await getRequest({ url: '/categories' });
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
        const resData = { ...data, amount: Number(data.amount), price: Number(data.price) }
        const response = await patchRequest({
            url: `/products/${id}`,
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
                        <Skeleton className='w-full max-w-[40%] aspect-square' />
                        <div className='w-full flex flex-col gap-3'>
                            <Skeleton className='w-full h-14' />
                            <Skeleton className='w-full h-14' />
                            <Skeleton className='w-full h-14' />
                            <Skeleton className='w-full h-14' />
                            <Skeleton className='w-full h-14' />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-start items-start gap-5">
                        <div className='w-full max-w-[40%] aspect-square border border-cLightGray rounded-lg'>
                            <ImageUploader
                                previewPlaceholder={`${data?.image}`}
                                onUploadSuccess={(url: string) => {
                                    setValue('image', url, { shouldDirty: true });
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
                                    autoComplete='off'
                                />
                                {errors.name && <p className="text-red-500 text-sm text-right">{errors.name.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='price' className="text-base font-semibold text-cDarkBlue cursor-pointer">Цена</label>
                                <input
                                    id='price'
                                    type="text"
                                    {...register('price', { required: 'Цена обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Цена'
                                    autoComplete='off'
                                />
                                {errors.price && <p className="text-red-500 text-sm text-right">{errors.price.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='amount' className="text-base font-semibold text-cDarkBlue cursor-pointer">Кол-во на складе</label>
                                <input
                                    id='amount'
                                    type="text"
                                    {...register('amount', { required: 'Кол-во на складе обязателен' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Кол-во на складе'
                                    autoComplete='off'
                                />
                                {errors.amount && <p className="text-red-500 text-sm text-right">{errors.amount.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='height' className="text-base font-semibold text-cDarkBlue cursor-pointer">Высота</label>
                                <input
                                    id='height'
                                    type="text"
                                    {...register('height', { required: 'Высота обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Высота'
                                    autoComplete='off'
                                />
                                {errors.height && <p className="text-red-500 text-sm text-right">{errors.height.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='width' className="text-base font-semibold text-cDarkBlue cursor-pointer">Ширина</label>
                                <input
                                    id='width'
                                    type="text"
                                    {...register('width', { required: 'Ширина обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Ширина'
                                    autoComplete='off'
                                />
                                {errors.width && <p className="text-red-500 text-sm text-right">{errors.width.message}</p>}
                            </div>
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='unit' className="text-base font-semibold text-cDarkBlue cursor-pointer">Единица измерения</label>
                                <select
                                    id='unit'
                                    {...register('unit', { required: 'Единица измерения обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                >
                                    <option value="" disabled selected hidden className="text-base font-semibold text-cDarkBlue">Выберите eдиницу измерения</option>
                                    <option value={"piece"}>В штуках</option>
                                    <option value={"meter"}>В сантиметрах</option>
                                </select>
                                {errors.unit && <p className="text-red-500 text-sm text-right">{errors.unit.message}</p>}
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
                                        {errors.categoryId && <p className="text-red-500 text-sm text-right">{errors.categoryId.message}</p>}
                                    </div>
                                )
                            }
                        </div>

                        <div className='flex gap-3 absolute -top-20 right-5'>
                            <ConfirmModal title='Вы действительно хотите отменить изменения товара?' setState={(state: boolean) => {
                                state && navigate(-1) && reset();
                            }}>
                                <Button variant={'customOutline'} type="button" className="px-10">Отменить</Button>
                            </ConfirmModal>
                            <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? 'Загрузка...' : 'Сохранить изменения'}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div >
    );
};