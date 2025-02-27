import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ICategoryCreateUpdate } from '@/models/categories';
import { postRequest } from '@/lib/apiHandlers';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';


export const AddCategoryForm = ({ children, onUpdate }: { children: React.ReactNode, onUpdate: () => void }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ICategoryCreateUpdate>({ mode: 'onChange' });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit: SubmitHandler<ICategoryCreateUpdate> = async (data: any) => {
        setLoading(true);
        const res = await postRequest({ url: '/categories', data });

        if (res.status === 200 || res.status === 201) {
            setLoading(false);
            reset();
            onUpdate();
            setIsOpen(false);
            toast({
                title: 'Успех',
                description: 'Категория успешно добавлена',
                variant: 'default',
            })
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при добавлении категории',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Добавить категорию</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full">
                    <input
                        {...register('name', { required: 'Название категории обязательно' })}
                        type="text"
                        placeholder="Добавить новую категорию"
                        className="w-full border rounded-lg p-2"
                        autoComplete='off'
                    />
                    {errors.name && <span className="text-red-500 text-sm text-left">{errors.name.message}</span>}
                    <Button type="submit" disabled={loading} className='mt-5'>
                        Добавить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
