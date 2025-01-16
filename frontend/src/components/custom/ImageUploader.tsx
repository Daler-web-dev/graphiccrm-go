import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

interface ImageUploaderProps {
    previewPlaceholder?: string;
    onUploadSuccess: (url: string) => void;
    className?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    previewPlaceholder,
    onUploadSuccess,
    className
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(previewPlaceholder ? import.meta.env.VITE_API_URL + "/" + previewPlaceholder : '/images/humanPlaceholder.png');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setIsUploading(true);

            const formData = new FormData();
            formData.append('image', file);

            axios.post(import.meta.env.VITE_API_URL + '/upload', formData, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('accessToken')}`,
                },
            })
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        console.log(res.data.data);

                        onUploadSuccess(res.data.data.imageUrl);
                        toast({
                            title: 'Успех',
                            description: 'Файл успешно загружен',
                        })
                        setIsUploading(false);
                    } else {
                        toast({
                            title: 'Ошибка',
                            description: 'Произошла ошибка при загрузке файла',
                            variant: 'destructive',
                        });
                    }
                    setIsUploading(false);
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    setIsUploading(false);
                });
        }
    };

    return (
        <div className={cn("w-full relative border-1 border-gray-200 aspect-square rounded-3xl", className)}>
            <img
                src={imagePreview || previewPlaceholder}
                alt="Preview"
                className="object-cover rounded-3xl w-full aspect-square"
            />
            <label
                htmlFor="imageUpload"
                className="cursor-pointer absolute top-0 left-0 right-0 bottom-0 opacity-0"
            >
                <input
                    type="file"
                    id="imageUpload"
                    accept=".webp"
                    onChange={(e) => {
                        handleFileChange(e);
                    }}
                    disabled={isUploading}
                />
            </label>
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-3xl">
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin h-8 w-8 text-cOrange"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
