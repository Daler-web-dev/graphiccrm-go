import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

enum CategoriesEnum {
    category1 = 'Category1',
    category2 = 'Category2',
    category3 = 'Category3',
}

type Inputs = {
    category: CategoriesEnum;
    price: number;
    material: string;
    inWarehouse: number;
    height: number;
    width: number;
    weight: number;
    description?: string;
    image?: FileList;
};

export const AddProduct: React.FC = () => {
    const { register, handleSubmit, watch } = useForm<Inputs>();
    const [_, setImagePreview] = useState<string | null>('/productPlaceholder.png');

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    const imageFile = watch('image');
    React.useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [imageFile]);

    return (
        <div className="w-full flex flex-col justify-center gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-start gap-5">
                <div className="w-[35%]">
                    <ImageUploader
                        register={register('image')}
                        previewPlaceholder="/productPlaceholder.png"
                    />
                    <Button variant="outline" type="submit" className="mt-5 w-full rounded-3xl">
                        Добавить товар
                    </Button>
                </div>
                <Card className="text-cBlack rounded-3xl w-[65%]">
                    <CardHeader>
                        <CardTitle>Добавление товара</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center p-3 bg-cWhite rounded-2xl">
                            <label htmlFor="category" className="font-normal text-xl">
                                Категория
                            </label>
                            <select
                                className="w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl"
                                id="category"
                                {...register('category')}
                            >
                                {Object.values(CategoriesEnum).map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-2xl">
                            <label htmlFor="price" className="font-normal text-xl">
                                Стоимость
                            </label>
                            <input
                                {...register('price')}
                                id="price"
                                className="w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg"
                                placeholder="Укажите стоимость"
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 bg-cWhite rounded-2xl">
                            <label htmlFor="material" className="font-normal text-xl">
                                Материал
                            </label>
                            <input
                                id="material"
                                className="w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg"
                                {...register('material')}
                                placeholder="Укажите материал"
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-2xl">
                            <label htmlFor="inWarehouse" className="font-normal text-xl">
                                На складе
                            </label>
                            <input
                                id="inWarehouse"
                                className="w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg"
                                {...register('inWarehouse')}
                                placeholder="Укажите количество на складе"
                            />
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl bg-cWhite'>
                            <label htmlFor='height' className='font-normal text-xl'>
                                Высота
                            </label>
                            <input
                                id='height'
                                className='w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg'
                                {...register("height")}
                                placeholder='Укажите высоту'
                            />
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <label htmlFor='width' className='font-normal text-xl'>
                                Ширина
                            </label>
                            <input
                                id='width'
                                className='w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg'
                                {...register("width")}
                                placeholder='Укажите ширину'
                            />
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl bg-cWhite'>
                            <label htmlFor='weight' className='font-normal text-xl'>
                                Вес
                            </label>
                            <input
                                id='weight'
                                className='w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg'
                                {...register("weight")}
                                placeholder='Укажите вес'
                            />
                        </div>
                        <div className="flex justify-center flex-col items-start gap-1 text-left p-3 rounded-2xl">
                            <label htmlFor="description" className="font-normal text-xl">
                                Дополнительная информация
                            </label>
                            <textarea
                                id="description"
                                className="w-full py-1.5 px-3 rounded-xl font-normal text-base border border-cWhite outline-1 outline-gray-400"
                                {...register('description')}
                                placeholder="Добавьте дополнительную информацию"
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
