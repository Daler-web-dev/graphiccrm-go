import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ImageUploader from "@/components/custom/ImageUploader";
import { toast } from "@/hooks/use-toast";
import { getRequest, postRequest } from "@/lib/apiHandlers";
import ConfirmModal from "@/components/custom/ConfirmModal";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface IProduct {
    id: string;
    name: string;
    articul: string;
    unitPrice: number;
    count: number;
    amountInBox: number;
    categoryId: string;
    imagePath: string;
    totalPrice: number;
}

export const NewProduct: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = React.useState([{ id: '', name: '' }]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<IProduct>();
    setValue('imagePath', "")

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const response = await getRequest({ url: '/categories' });
            if (response.status === 200) {
                setCategories(response.data.data);
                setLoading(false);
            } else {
                setLoading(false);
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при получении категорий',
                    variant: 'destructive',
                });
            }
        }

        fetchCategories();
    }, [reset])

    const onSubmit = async (data: any) => {
        if (data.imagePath === "") return toast({
            title: 'Ошибка',
            description: 'Пожалуйста, загрузите изображение',
            variant: 'destructive',
        })
        const resData = { ...data, count: Number(data.count), amountInBox: Number(data.amountInBox), unitPrice: Number(data.unitPrice) }

        const response = await postRequest({ url: '/products', data: resData });
        if (response.status === 200 || response.status === 201) {
            toast({
                title: 'Успех',
                description: 'Товар успешно добавлен',
            });
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при добавлении товара',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className='relative'>
            <Card className="w-full overflow-x-auto p-5 mb-5">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5">
                    <div className="w-1/2 aspect-square">
                        <ImageUploader
                            onUploadSuccess={(url: string) => {
                                setValue('imagePath', url);
                            }}
                            className='border border-cGray'
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
                        <ConfirmModal title='Вы действительно хотите отменить добавление агента?' setState={(state: boolean) => {
                            state && navigate(-1) && reset();
                        }}>
                            <Button variant={'customOutline'} type="button" className="px-10">Отменить</Button>
                        </ConfirmModal>
                        <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting}>
                            {isSubmitting ? 'Загрузка...' : 'Добавить агента'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
