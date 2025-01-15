import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { patchRequest, getRequest } from "@/lib/apiHandlers";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ICategoryCreateUpdate } from "@/models/categories";

interface EditCategoryProps {
    categoryId: number;
    children: React.ReactNode;
}

export const EditCategory: React.FC<EditCategoryProps> = ({ categoryId, children }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<ICategoryCreateUpdate | null>(null);

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ICategoryCreateUpdate>();

    useEffect(() => {
        if (isOpen) {
            const fetchCategoryData = async () => {
                const response = await getRequest({ url: `/categories/${categoryId}` });
                if (response.status === 200 || response.status === 201) {
                    const { name } = response.data.data

                    setInitialData({ name });
                    reset({ name })
                } else {
                    toast({
                        title: "Ошибка",
                        description: "Произошла ошибка при получении категории",
                        variant: "destructive",
                    });
                }
            };

            fetchCategoryData();
        }
    }, [isOpen, categoryId, reset]);

    const onSubmit = async (data: any) => {
        if (!isDirty) {
            toast({
                title: "Нет изменений",
                description: "Ни одно поле не было изменено",
            });
            setIsOpen(false);
            return;
        }

        setLoading(true);

        const res = await patchRequest({
            url: `/categories/${categoryId}`,
            data,
        })

        if (res.status === 200 || res.status === 201) {
            toast({
                title: "Успех",
                description: "Категория успешно обновлена",
            });
            navigate(0);
            setIsOpen(false);
        } else {
            toast({
                title: "Ошибка",
                description: "Произошла ошибка при обновлении категории",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-lg p-6 bg-white rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Редактирование категории</DialogTitle>
                </DialogHeader>
                {initialData ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                        <div>
                            <label className="block text-sm text-[#313131] ml-2">Наименование</label>
                            <input
                                type="text"
                                placeholder="Наименование"
                                {...register("name", { required: true })}
                                className="w-full text-base placeholder:text-sm text-[#1c1b1f] px-4 py-2 bg-[#f2f2f2] rounded-lg outline-none"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-cGradientBg text-white px-4 py-2 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Загрузка..." : "Сохранить"}
                        </Button>
                    </form>
                ) : (
                    <div className="flex flex-col gap-5">
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};