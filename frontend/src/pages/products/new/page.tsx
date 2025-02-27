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
import { IProduct } from "@/models/products";

export const NewProduct: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = React.useState([{ id: '', name: '' }]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [selectedImage, setSelectedImage] = React.useState<string>("");

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<IProduct>({ mode: "onChange" });
    setValue('image', selectedImage)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const response = await getRequest({ url: '/categories', params: { limit: 10000 } });
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

    const onSubmit = async (data: IProduct) => {
        // if (data.image === "") return toast({
        //     title: 'Ошибка',
        //     description: 'Пожалуйста, загрузите изображение',
        //     variant: 'destructive',
        // })

        const resData = { ...data, amount: Number(data.amount), price: Number(data.price) }

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
                                setValue('image', url);
                                setSelectedImage(url);
                            }}
                            className='border border-cGray'
                        />
                    </div>
                    <div className="w-full">
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='name' className="text-base font-semibold text-cDarkBlue cursor-pointer">Наименование</label>
                            <input
                                id='name'
                                type="text"
                                {...register('name', { required: 'Наименование обязательно' })}
                                className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                placeholder='Наименование'
                                autoComplete="off"
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                        <ConfirmModal title='Вы действительно хотите отменить добавление товара?' setState={(state: boolean) => {
                            state && navigate(-1) && reset();
                        }}>
                            <Button variant={'customOutline'} type="button" className="px-10">Отменить</Button>
                        </ConfirmModal>
                        <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting}>
                            {isSubmitting ? 'Загрузка...' : 'Добавить товар'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
