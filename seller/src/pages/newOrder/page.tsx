import { Card } from '@/components/ui/card';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ClientSearch } from './components/ClientSearch';
import { toast } from '@/hooks/use-toast';
import { ProductSearch } from './components/ProductsSearch';
import { postRequest } from '@/lib/apiHandlers';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IOrder } from '@/models/order';
import MultiImageUploader from './components/MultiImageUploader';

export const NewOrder: React.FC = () => {
    const navigate = useNavigate();
    const [client, setClient] = React.useState<string>("");
    const [products, setProducts] = React.useState<any>([]);
    const { register, handleSubmit, setValue } = useForm<IOrder>();
    setValue("clientId", client);
    setValue("products", products);

    const onSubmit = async (data: any) => {
        if (data.clientId === "") return toast({ title: 'Ошибка', description: 'Выберите клиента', variant: 'destructive', });
        if (data.products.length <= 0) return toast({ title: 'Ошибка', description: 'Выберите продукты', variant: 'destructive', });

        const res = await postRequest({ url: '/orders', data })

        if (res.status === 200 || res.status === 201) {
            toast({
                title: 'Успех',
                description: 'Заказ успешно создан',
            });
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при создании заказа',
                variant: 'destructive',
            })
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='relative'>
            <Card className='w-full overflow-auto my-5 p-5 space-y-3'>
                <Button
                    variant={"custom"}
                    className='px-10 absolute -top-20 right-5'
                    type='submit'
                >
                    Заказать
                </Button>
                <div className='flex justify-between items-center gap-2'>
                    <div className='flex gap-2'>
                        <ClientSearch setValue={setClient} />
                        <select
                            {...register('paymentMethod')}
                            className="w-1/2 p-2 border rounded-lg outline-none bg-transparent"
                        >
                            <option value="" hidden>Выберите тип оплаты</option>
                            <option value="cash">Наличными</option>
                            <option value="transfer">Перевод</option>
                            <option value="credit">Долг</option>
                        </select>
                    </div>
                    <Button
                        variant={"customOutline"}
                        className='px-10'
                        onClick={() => navigate('/newOrder/editor')}
                    >
                        Перейти в редактор
                    </Button>
                </div>
                <ProductSearch setValue={setProducts} />
            </Card>
            <MultiImageUploader onUploadSuccess={(data) => {
                console.log(data);

                setValue('attachments', data);
            }} />
        </form>
    );
};