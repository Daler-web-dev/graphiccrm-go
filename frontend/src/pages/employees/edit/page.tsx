import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getRequest, patchRequest } from '@/lib/apiHandlers';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/custom/ImageUploader';
import ConfirmModal from '@/components/custom/ConfirmModal';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface EditAgentForm {
    name: string;
    surname: string;
    phoneNumber: string;
    imagePath: string;
}

export const EditAgent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<EditAgentForm>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<EditAgentForm | null>(null);

    useEffect(() => {
        const fetchAgent = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/agent/employees/${id}` });

            if (res.status === 200 || res.status === 201) {
                const { name, surname, phoneNumber, imagePath } = res.data;
                reset({ name, surname, phoneNumber, imagePath });
                setData(res.data);
                setValue('imagePath', imagePath);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные агента',
                    variant: 'destructive',
                });
            }
        };

        fetchAgent();
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        const response = await patchRequest({
            url: `/agent/employees/${id}`,
            data,
        });

        if (response.status === 200 || response.status === 201) {
            toast({
                title: 'Успех',
                description: 'Данные агента успешно обновлены',
            });
            reset(data);
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить данные агента',
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
                                previewPlaceholder={`${data?.imagePath}`}
                                onUploadSuccess={(url: string) => {
                                    setValue('imagePath', url, { shouldDirty: true });
                                }}
                            />
                        </div>
                        <div className="w-full space-y-3">
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='name' className="text-base font-semibold text-cDarkBlue cursor-pointer">Имя</label>
                                <input
                                    id='name'
                                    type="text"
                                    {...register('name', { required: 'Имя обязательно' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Имя'
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='surname' className="text-base font-semibold text-cDarkBlue cursor-pointer">Фамилия</label>
                                <input
                                    id='surname'
                                    type="text"
                                    {...register('surname', { required: 'Фамилия обязательна' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Фамилия'
                                />
                                {errors.surname && <p className="text-red-500 text-sm">{errors.surname.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='phoneNumber' className="text-base font-semibold text-cDarkBlue cursor-pointer">Номер телефона</label>
                                <input
                                    id='phoneNumber'
                                    type="text"
                                    placeholder="+998XXXXXXXXX"
                                    {...register("phoneNumber", {
                                        required: "Номер телефона обязателен",
                                        pattern: {
                                            value: /^\+998\d{9}$/,
                                            message: "Введите в формате +998XXXXXXXXX",
                                        },
                                    })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                            </div>
                        </div>

                        <div className='flex gap-3 absolute top-5 right-5'>
                            <ConfirmModal title='Вы действительно хотите отменить изменения агента?' setState={(state: boolean) => {
                                state && navigate(-1) && reset();
                            }}>
                                <Button variant={'customOutline'} type="button" className="px-10">Отменить</Button>
                            </ConfirmModal>
                            <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? 'Загрузка...' : 'Сохранить агента'}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div >
    );
};