import ImageUploader from '@/components/custom/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

enum AgentsEnum {
    agent1 = 'agent1',
    agent2 = 'agent2',
    agent3 = 'agent3',
}

type Inputs = {
    agent: AgentsEnum;
    address: string;
    phoneNumber: number;
    description?: string;
    image?: FileList;
};

export const AddClient: React.FC = () => {
    const { register, handleSubmit, watch } = useForm<Inputs>();
    const [_, setImagePreview] = useState<string | null>('/clientPlaceholder.png');

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    const imageFile = watch('image');
    React.useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [imageFile]);

    return (
        <div className="w-full flex flex-col justify-center gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-start gap-5">
                <div className="w-[35%]">
                    <ImageUploader
                        register={register('image')}
                        previewPlaceholder="/clientPlaceholder.png"
                    />
                    <Button variant="outline" type="submit" className="mt-5 w-full rounded-3xl">
                        Добавить клиента
                    </Button>
                </div>
                <Card className="text-cBlack rounded-3xl w-[65%]">
                    <CardHeader>
                        <CardTitle>Добавление клиента</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center p-3 bg-cWhite rounded-2xl">
                            <label htmlFor="address" className="font-normal text-xl">
                                Адрес
                            </label>
                            <input
                                id="address"
                                className="w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg"
                                {...register('address')}
                                placeholder="Укажите материал"
                            />
                        </div>
                        <div className='flex justify-between items-center p-3 rounded-2xl'>
                            <label htmlFor='phoneNumber' className='font-normal text-xl'>
                                Номер телефона
                            </label>
                            <input
                                id='phoneNumber'
                                className='w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl text-lg'
                                {...register("phoneNumber")}
                                placeholder='Укажите вес'
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 bg-cWhite rounded-2xl">
                            <label htmlFor="agent" className="font-normal text-xl">
                                Выберите агента
                            </label>
                            <select
                                className="w-[40%] outline-1 outline-gray-400 py-1.5 px-3 rounded-xl"
                                id="agent"
                                {...register('agent')}
                            >
                                {Object.values(AgentsEnum).map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center flex-col items-start gap-1 text-left p-3 rounded-2xl">
                            <label htmlFor="description" className="font-normal text-xl">
                                Дополнительная информация
                            </label>
                            <textarea
                                id="description"
                                className="w-full py-1.5 px-3 rounded-xl font-normal text-base border border-cWhite outline-1 outline-gray-400"
                                {...register('description')}
                                placeholder="Добавьте дополнительную информацию"
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
