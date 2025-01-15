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
import { IEmployeeCreateUpdate } from '@/models/employees';

export const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm<IEmployeeCreateUpdate>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IEmployeeCreateUpdate | null>(null);

    useEffect(() => {
        const fetchAgent = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/users/${id}` });

            if (res.status === 200 || res.status === 201) {
                const { image, username, password, role } = res.data.data;
                reset({ image, username, password, role });
                setData(res.data.data);
                setValue('image', image);
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
            url: `/users/${id}`,
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
                                className='border border-gray-200'
                                previewPlaceholder={`${data?.image}`}
                                onUploadSuccess={(url: string) => {
                                    setValue('image', url, { shouldDirty: true });
                                }}
                            />
                        </div>
                        <div className="w-full space-y-3">
                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='username' className="text-base font-semibold text-cDarkBlue cursor-pointer">Логин</label>
                                <input
                                    id='username'
                                    type="text"
                                    {...register('username', { required: '!' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Логин'
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='password' className="text-base font-semibold text-cDarkBlue cursor-pointer">Пароль</label>
                                <input
                                    id='password'
                                    type="text"
                                    {...register('password', { required: '!' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Пароль'
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                                <label htmlFor='role' className="text-base font-semibold text-cDarkBlue cursor-pointer">Роль</label>
                                <select
                                    id='role'
                                    {...register('role', { required: '!' })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                >
                                    <option value="manager">Менеджер</option>
                                    <option value="seller">Продавец</option>
                                    <option value="admin">Администратор</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                            </div>
                        </div>

                        <div className='flex gap-3 absolute -top-20 right-5'>
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