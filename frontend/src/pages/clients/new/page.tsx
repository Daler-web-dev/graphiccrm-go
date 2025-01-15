import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { postRequest } from "@/lib/apiHandlers";
import ConfirmModal from "@/components/custom/ConfirmModal";
import { Card } from "@/components/ui/card";
import ImageUploader from "@/components/custom/ImageUploader";
import { IClientCreateUpdate } from "@/models/clients";


export const AddClient: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<IClientCreateUpdate>();
    setValue('image', "")

    const onSubmit = async (data: any) => {
        if (data.imagePath === "") return toast({
            title: 'Ошибка',
            description: 'Пожалуйста, загрузите изображение',
            variant: 'destructive',
        })

        const response = await postRequest({ url: '/clients', data });
        if (response.status === 200 || response.status === 201) {
            toast({
                title: 'Успех',
                description: 'Агент успешно добавлен',
            });
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при добавлении агента',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className='relative'>
            <Card className="w-full overflow-x-auto p-5 mb-5">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5">
                    <div className="w-1/2 aspect-square">
                        <ImageUploader
                            onUploadSuccess={(url: string) => {
                                setValue('image', url);
                            }}
                            className='border border-cGray'
                        />
                    </div>
                    <div className="w-full">
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
                            <label htmlFor='address' className="text-base font-semibold text-cDarkBlue cursor-pointer">Адрес</label>
                            <input
                                id='address'
                                type="text"
                                {...register('address', { required: 'Адрес обязателен' })}
                                className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                placeholder='Адрес'
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
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
                            />
                            {errors.contactInfo && <p className="text-red-500 text-sm">{errors.contactInfo.message}</p>}
                        </div>
                        <div className='w-full flex flex-col justify-start items-start bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='note' className="text-base font-semibold text-cDarkBlue cursor-pointer">Дополнительная информация</label>
                            <textarea
                                id='note'
                                placeholder="Дополнительная информация"
                                {...register("Note", {
                                    required: "Дополнительная информация обязательна",
                                })}
                                className="mt-2 p-2 w-full border rounded-lg outline-none bg-transparent"
                            />
                            {errors.Note && <p className="text-red-500 text-sm">{errors.Note.message}</p>}
                        </div>
                    </div>

                    <div className='flex gap-3 absolute -top-16 right-0'>
                        <ConfirmModal title='Вы действительно хотите отменить добавление агента?' setState={(state: boolean) => {
                            state && navigate(-1) && reset();
                        }}>
                            <Button type="button" variant={"customOutline"} className="px-10">Отменить</Button>
                        </ConfirmModal>
                        <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting}>
                            {isSubmitting ? 'Загрузка...' : 'Добавить агента'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
