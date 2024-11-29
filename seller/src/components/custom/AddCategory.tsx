import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface CategoryFormValues {
    title: string;
}

export const AddCategoryForm: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<CategoryFormValues>();

    const onSubmit: SubmitHandler<CategoryFormValues> = (data) => {
        console.log(data);

        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 pt-5 w-full">
            <input
                {...register('title', { required: 'Название категории обязательно' })}
                type="text"
                placeholder="Добавить новую категорию"
                className="w-full border rounded-lg p-2"
            />
            <Button type="submit" variant="secondary">
                Добавить
            </Button>
        </form>
    );
};
