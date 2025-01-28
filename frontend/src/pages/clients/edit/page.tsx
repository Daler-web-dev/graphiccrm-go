import ConfirmModal from '@/components/custom/ConfirmModal';
import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { getRequest, patchRequest } from '@/lib/apiHandlers';
import { IClientCreateUpdate } from '@/models/clients';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export const EditClient: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<IClientCreateUpdate>({ mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IClientCreateUpdate>();

    useEffect(() => {
        const fetchAgent = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/clients/${id}` });

            if (res.status === 200 || res.status === 201) {
                reset({ ...res.data.data });
                setData(res.data.data);
                setValue('image', res.data.data.image);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные клиента',
                    variant: 'destructive',
                });
            }
        };

        fetchAgent();
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        const response = await patchRequest({
            url: `/clients/${id}`,
            data,
        });

        if (response.status === 200 || response.status === 201) {
            toast({
                title: 'Успех',
                description: 'Данные клиента успешно обновлены',
            });
            reset(data);
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить данные клиента',
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
                        <div className='w-1/2 aspect-square'>
                            <ImageUploader
                                previewPlaceholder={`${data?.image}`}
                                onUploadSuccess={(url: string) => {
                                    setValue('image', url, { shouldDirty: true });
                                }}
                            />
                        </div>
                        <div className="w-full space-y-2">
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='name' className="text-base font-semibold text-cDarkBlue cursor-pointer">Имя</label>
                                <input
                                    id='name'
                                    type="text"
                                    {...register('name', { required: 'Имя обязательно' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Имя'
                                    autoComplete='off'
                                />
                                {errors.name && <p className="text-red-500 text-sm text-right">{errors.name.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='surname' className="text-base font-semibold text-cDarkBlue cursor-pointer">Фамилия</label>
                                <input
                                    id='surname'
                                    type="text"
                                    {...register('surname', { required: 'Фамилия обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Фамилия'
                                    autoComplete='off'
                                />
                                {errors.surname && <p className="text-red-500 text-sm text-right">{errors.surname.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='phoneNumber' className="text-base font-semibold text-cDarkBlue cursor-pointer">Номер телефона</label>
                                <input
                                    id='phoneNumber'
                                    type="text"
                                    placeholder="+998XXXXXXXXX"
                                    {...register("contactInfo", {
                                        required: "Номер телефона обязателен",
                                        pattern: {
                                            value: /^\+998\d{9}$/,
                                            message: "Введите в формате +998XXXXXXXXX",
                                        },
                                    })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    autoComplete='off'
                                />
                                {errors.contactInfo && <p className="text-red-500 text-sm text-right">{errors.contactInfo.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='address' className="text-base font-semibold text-cDarkBlue cursor-pointer">Адрес</label>
                                <input
                                    id='address'
                                    type="text"
                                    {...register('address', { required: 'Адрес обязателен' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Адрес'
                                    autoComplete='off'
                                />
                                {errors.address && <p className="text-red-500 text-sm text-right">{errors.address.message}</p>}
                            </div>

                            <div className='w-full flex justify-start items-start flex-col bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='note' className="text-base font-semibold text-cDarkBlue cursor-pointer">Дополнительная информация</label>
                                <textarea
                                    id='note'
                                    {...register('Note')}
                                    className="mt-2 p-2 w-full border rounded-lg outline-none bg-transparent"
                                    placeholder='Дополнительная информация'
                                    autoComplete='off'
                                />
                                {errors.Note && <p className="text-red-500 text-sm text-right">{errors.Note.message}</p>}
                            </div>
                        </div>

                        <div className='flex gap-3 absolute -top-20 right-5'>
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