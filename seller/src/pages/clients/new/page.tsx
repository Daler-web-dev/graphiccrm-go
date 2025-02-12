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
import { CircleAlert } from "lucide-react";


export const AddClient: React.FC = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = React.useState<string>("");
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<IClientCreateUpdate>({ mode: "onChange" });
    setValue('image', selectedImage)

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
                description: 'Клиент успешно добавлен',
            });
            navigate(-1);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при добавлении клиента',
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
                                setSelectedImage(url);
                            }}
                            className='border border-cGray'
                        />
                    </div>
                    <div className="w-full">
                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='name' className="text-base font-semibold text-cDarkBlue cursor-pointer text-left">Имя</label>
                            <div className='w-full flex justify-end items-center gap-2'>
                                {errors.name && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                <input
                                    id='name'
                                    type="text"
                                    {...register('name', { required: true })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Имя'
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='surname' className="text-base font-semibold text-cDarkBlue cursor-pointer text-left">Фамилия</label>
                            <div className='w-full flex justify-end items-center gap-2'>
                                {errors.surname && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                <input
                                    id='surname'
                                    type="text"
                                    {...register('surname', { required: true })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Фамилия'
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='phoneNumber' className="text-base font-semibold text-cDarkBlue cursor-pointer text-left">Номер телефона</label>
                            <div className='w-full flex justify-end items-center gap-2'>
                                {errors.contactInfo && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                <input
                                    id='phoneNumber'
                                    type="text"
                                    placeholder="+998XXXXXXXXX"
                                    autoComplete="off"
                                    {...register("contactInfo", {
                                        required: "Номер телефона обязателен",
                                        pattern: {
                                            value: /^\+998\d{9}$/,
                                            message: "Введите в формате +998XXXXXXXXX",
                                        },
                                    })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        <div className='w-full flex justify-between items-center gap-5 bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='address' className="text-base font-semibold text-cDarkBlue cursor-pointer text-left">Адрес</label>
                            <div className='w-full flex justify-end items-center gap-2'>
                                {errors.address && <p className="text-red-500 text-sm text-right"><CircleAlert /></p>}
                                <input
                                    id='address'
                                    type="text"
                                    {...register('address', { required: true })}
                                    className="mt-2 p-2 w-1/2 border rounded-lg outline-none bg-transparent"
                                    placeholder='Адрес'
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className='w-full flex flex-col justify-start items-start bg-cLightGray px-3 py-2 rounded-lg'>
                            <label htmlFor='note' className="text-base font-semibold text-cDarkBlue cursor-pointer text-left">Дополнительная информация</label>
                            <textarea
                                id='note'
                                placeholder="Дополнительная информация"
                                autoComplete="off"
                                {...register("Note")}
                                className="mt-2 p-2 w-full border rounded-lg outline-none bg-transparent"
                            />
                            {errors.Note && <p className="text-red-500 text-sm text-right">{errors.Note.message}</p>}
                        </div>
                    </div>

                    <div className='flex gap-3 absolute -top-20 right-5'>
                        <ConfirmModal title='Вы действительно хотите отменить добавление клиента?' setState={(state: boolean) => {
                            state && navigate(-1) && reset();
                        }}>
                            <Button type="button" variant={"customOutline"} className="px-10">Отменить</Button>
                        </ConfirmModal>
                        <Button variant={'custom'} type="submit" className="px-10" disabled={isSubmitting}>
                            {isSubmitting ? 'Загрузка...' : 'Добавить клиента'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
