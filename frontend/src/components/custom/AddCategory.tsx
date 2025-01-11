import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ICategoryCreateUpdate } from '@/types/categories';
import { postRequest } from '@/lib/apiHandlers';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';


export const AddCategoryForm = ({ children }: { children: React.ReactNode }) => {
    const { register, handleSubmit, reset } = useForm<ICategoryCreateUpdate>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<ICategoryCreateUpdate> = async (data: any) => {
        setLoading(true);
        const res = await postRequest({ url: '/categories', data });

        if (res.status === 200 || res.status === 201) {
            setLoading(false);
            reset();
            navigate(0);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при добавлении категории',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog>
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
                        className="w-full border rounded-lg p-2 mb-5"
                    />
                    <Button type="submit" disabled={loading}>
                        Добавить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
