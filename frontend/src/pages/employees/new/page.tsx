import { useForm } from 'react-hook-form';
import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { postRequest } from '@/lib/apiHandlers';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/custom/ConfirmModal';
import { Card } from '@/components/ui/card';
import { IEmployeeCreateUpdate } from '@/models/employees'; // Import Roles

export const AddEmployee = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<IEmployeeCreateUpdate>({ mode: 'onChange' });
    setValue('image', "");

    const onSubmit = async (data: any) => {
        if (data.image === "") {
            return toast({
                title: 'Ошибка',
                description: 'Пожалуйста, загрузите изображение',
                variant: 'destructive',
            });
        }

        const response = await postRequest({ url: '/users', data });

        if (response.status === 200 || response.status === 201) {
            toast({
                title: 'Успех',
                description: 'Сотрудник успешно добавлен',
            });
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при добавлении сотрудника',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className='relative'>
            <Card className='w-full overflow-x-auto p-5 mb-5'>
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5">
                    <div className='w-1/2 aspect-square'>
                        <ImageUploader
                            onUploadSuccess={(url: string) => {
                                setValue('image', url);
                            }}
                            className='border border-cGray'
                        />
                    </div>
                    <div className="w-full">
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='username' className="text-base font-semibold text-cDarkBlue cursor-pointer">Логин</label>
                            <input
                                id='username'
                                type="text"
                                {...register('username', { required: 'Имя пользователя обязательно' })}
                                className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                placeholder='Логин'
                                autoComplete='off'
                            />
                            {errors.username && <p className="text-red-500 text-sm text-right">{errors.username.message}</p>}
                        </div>

                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='password' className="text-base font-semibold text-cDarkBlue cursor-pointer">Пароль</label>
                            <input
                                id='password'
                                type="password"
                                {...register('password', { required: 'Пароль обязателен' })}
                                className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                placeholder='Пароль'
                                autoComplete='off'
                            />
                            {errors.password && <p className="text-red-500 text-sm text-right">{errors.password.message}</p>}
                        </div>

                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='role' className="text-base font-semibold text-cDarkBlue cursor-pointer">Роль</label>
                            <select
                                id='role'
                                {...register('role', { required: 'Роль обязательна' })}
                                className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                            >
                                <option value="" disabled selected>Выберите роль</option>
                                <option value="manager">Менеджер</option>
                                <option value="seller">Продавец</option>
                                <option value="admin">Администратор</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm text-right">{errors.role.message}</p>}
                        </div>
                    </div>

                    <div className='flex gap-3 absolute -top-20 right-5'>
                        <ConfirmModal title='Вы действительно хотите отменить добавление сотрудника?' setState={(state: boolean) => {
                            if (state) {
                                reset();
                                navigate(-1);
                            }
                        }}>
                            <Button variant={'customOutline'} type="button" className="px-10">Отменить</Button>
                        </ConfirmModal>
                        <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting}>
                            {isSubmitting ? 'Загрузка...' : 'Добавить сотрудника'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
