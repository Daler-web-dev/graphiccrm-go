import ConfirmModal from '@/components/custom/ConfirmModal';
import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { getRequest, patchRequest } from '@/lib/apiHandlers';
import { IClientCreateUpdate } from '@/models/clients';
import { CircleAlert } from 'lucide-react';
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
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5">
                        <div className='w-full max-w-[40%] aspect-square'>
                            <ImageUploader
                                previewPlaceholder={`${data?.image}`}
                                onUploadSuccess={(url: string) => {
                                    setValue('image', url, { shouldDirty: true });
                                }}
                                className='border border-cLightGray rounded-lg'
                            />
                        </div>
                        <div className="w-full">
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='name' className="w-full text-left text-base font-semibold text-cDarkBlue cursor-pointer">Имя</label>
                                <div className='w-full flex justify-end items-center gap-2'>
                                    {errors.name && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                    <input
                                        id='name'
                                        type="text"
                                        {...register('name', { required: true })}
                                        className="mt-2 p-2 w-72 border rounded-lg outline-none bg-transparent"
                                        placeholder='Имя'
                                        autoComplete='off'
                                    />
                                </div>
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='surname' className="w-full text-left text-base font-semibold text-cDarkBlue cursor-pointer truncate">Фамилия</label>
                                <div className='w-full flex justify-end items-center gap-2'>
                                    {errors.surname && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                    <input
                                        id='surname'
                                        type="text"
                                        {...register('surname', { required: true })}
                                        className="mt-2 p-2 w-72 border rounded-lg outline-none bg-transparent"
                                        placeholder='Фамилия'
                                        autoComplete='off'
                                    />
                                </div>
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='phoneNumber' className="w-full text-left text-base font-semibold text-cDarkBlue cursor-pointer truncate">Номер телефона</label>
                                <div className='w-full flex justify-end items-center gap-2'>
                                    {errors.contactInfo && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                    <input
                                        id='phoneNumber'
                                        type="text"
                                        placeholder="+998XXXXXXXXX"
                                        {...register("contactInfo", {
                                            required: true,
                                            pattern: {
                                                value: /^\+998\d{9}$/,
                                                message: "Неправильный формат"
                                            },
                                        })}
                                        className="mt-2 p-2 w-72 border rounded-lg outline-none bg-transparent"
                                        autoComplete='off'
                                    />
                                </div>
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='address' className="w-full text-left text-base font-semibold text-cDarkBlue cursor-pointer truncate">Адрес</label>
                                <div className='w-full flex justify-end items-center gap-2'>
                                    {errors.address && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                    <input
                                        id='address'
                                        type="text"
                                        {...register('address', { required: true })}
                                        className="mt-2 p-2 w-72 border rounded-lg outline-none bg-transparent"
                                        placeholder='Адрес'
                                        autoComplete='off'
                                    />
                                </div>
                            </div>

                            <div className='w-full flex justify-start items-start flex-col bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='note' className="w-full text-left text-base font-semibold text-cDarkBlue cursor-pointer truncate">Дополнительная информация</label>
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
                            <ConfirmModal title='Вы действительно хотите отменить изменения клиента?' setState={(state: boolean) => {
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