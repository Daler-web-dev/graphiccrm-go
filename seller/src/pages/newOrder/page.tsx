import { Card } from '@/components/ui/card';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ClientSearch } from './components/ClientSearch';
import { toast } from '@/hooks/use-toast';
import { ProductSearch } from './components/ProductsSearch';
import { getRequest, postRequest } from '@/lib/apiHandlers';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// type OrderPaymentType = "PURCHASE" | "RETURN";

interface FormData {
    clientId: any;
    // paymentType: OrderPaymentType;
    discount: number;
    products: [
        {
            productId: string;
            quantity: number;
        }
    ];
}

export const NewOrder: React.FC = () => {
    const navigate = useNavigate();
    const [client, setClient] = React.useState<string>("");
    const [products, setProducts] = React.useState<any>([]);
    const { handleSubmit, setValue } = useForm<FormData>();
    setValue("clientId", client);
    setValue("products", products);

    useEffect(() => {
        const getClient = async () => {
            const res = await getRequest({ url: `/client/${client}` });
            if (res.status === 200 || res.status === 201) {
                setValue("discount", res.data.discount);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Скидка не найдена',
                    variant: 'destructive',
                })
            }
        }

        getClient();
    }, [client])

    const onSubmit = async (data: FormData) => {
        if (data.clientId === "") return toast({ title: 'Ошибка', description: 'Выберите клиента', variant: 'destructive', });
        // if (!data.paymentType) return toast({ title: 'Ошибка', description: 'Выберите тип заказа', variant: 'destructive', });
        if (!data.products) return toast({ title: 'Ошибка', description: 'Выберите продукты', variant: 'destructive', });

        const resData = { ...data, discount: Number(data.discount) }

        const res = await postRequest({ url: '/order', data: resData });

        if (res.status === 200 || res.status === 201) {
            toast({
                title: 'Успех',
                description: 'Заказ успешно создан',
            });

            navigate('/orders');
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при создании заказа',
                variant: 'destructive',
            })
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className='w-full overflow-auto my-5 p-5 space-y-3'>
                <div className='flex justify-between items-center gap-2'>
                    <ClientSearch setValue={setClient} />
                    <Button
                        variant={"customOutline"}
                        className='px-10'
                        onClick={() => navigate('/newOrder/editor')}
                    >
                        Перейти в редактор
                    </Button>
                    {/* <div className='space-x-2'>
                        <select
                            {...register('paymentType')}
                            className="p-2 border rounded-lg outline-none bg-transparent text-sm font-semibold"
                        >
                            <option value="" disabled selected hidden>Выберите тип оплаты заказа...</option>
                            <option value="PURCHASE">Заказ</option>
                            <option value="RETURN">Возврат</option>
                        </select>
                    </div> */}
                </div>
                <ProductSearch setValue={setProducts} />
            </Card>
        </form>
    );
};