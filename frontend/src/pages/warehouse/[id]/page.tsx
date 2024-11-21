import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

export const Product: React.FC = () => {
    // const { id } = useParams();
    const product = {
        id: 1,
        title: "Товар 1",
        description: "Описание",
        price: 100000,
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        overallLeft: 10,
        soldLastMonth: 5,
        producedLastMonth: 3,
        category: "Категория 1",
        material: "Материал 1",
        weight: "25 кг",
        height: "120 см",
        width: "90 см",
        info: "Дополнительная информация 1",
    }

    return (
        <div className='flex flex-col justify-center gap-5'>
            <Button className='absolute -top-16 right-0 px-10'></Button>
            <div className='flex justify-center items-start gap-5'>
                <div className='w-[35%]'>
                    <img src={product.image} alt="product image" className='object-cover rounded-3xl w-full aspect-square' />
                    <div className='flex gap-6'>
                        <Button variant={"outline"} className='mt-5 w-full rounded-3xl'>
                            <Edit className='mr-2' />
                            Редактировать
                        </Button>
                        <Button variant={"outline"} className='mt-5 w-full rounded-3xl'>
                            <Trash2 className='mr-2' />
                            Удалить
                        </Button>
                    </div>
                </div>
                <Card className='text-cBlack rounded-3xl w-[65%]'>
                    <CardHeader>
                        <CardTitle>{product.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                            <p className='font-normal text-xl'>Категория</p>
                            <span className='font-semibold text-xl'>{product?.category}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <p className='font-normal text-xl'>Стоимость</p>
                            <span className='font-semibold text-xl'>{product?.price}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                            <p className='font-normal text-xl'>Материал</p>
                            <span className='font-semibold text-xl'>{product?.material}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <p className='font-normal text-xl'>На складе</p>
                            <span className='font-semibold text-xl'>{product?.overallLeft} шт.</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                            <p className='font-normal text-xl'>Произведено в месяц</p>
                            <span className='font-semibold text-xl'>{product?.producedLastMonth} шт.</span>
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <p className='font-normal text-xl'>Продано за месяц</p>
                            <span className='font-semibold text-xl'>{product?.soldLastMonth} шт.</span>
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <p className='font-normal text-xl'>Высота</p>
                            <span className='font-semibold text-xl'>{product?.height}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-cWhite rounded-2xl'>
                            <p className='font-normal text-xl'>Ширина</p>
                            <span className='font-semibold text-xl'>{product?.width}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <p className='font-normal text-xl'>Вес</p>
                            <span className='font-semibold text-xl'>{product?.weight}</span>
                        </div>
                        <div className='flex justify-center flex-col items-start text-left p-3 rounded-2xl bg-cWhite'>
                            <p className='font-normal text-xl'>Дополнительная информация</p>
                            <span className='font-normal text-base'>{product?.info}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};