import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MultiImageUploaderProps {
    initialPreviews?: string[];
    onUploadSuccess: (urls: string[]) => void;
    className?: string;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
    initialPreviews = [],
    onUploadSuccess,
    className,
}) => {
    // 🔁 хранит ТОЛЬКО preview (для UI)
    const [previewList, setPreviewList] = useState<string[]>(initialPreviews);

    // 🔁 хранит ТОЛЬКО реальные ссылки от сервера
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialPreviews);

    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) inputRef.current.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const files = Array.from(event.target.files);
        setIsUploading(true);

        // Создание превью
        const localPreviews = await Promise.all(
            files.map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            })
        );

        setPreviewList((prev) => [...prev, ...localPreviews]);

        // Загрузка файлов
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/uploadMany`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                const newUrls: string[] = response.data?.data.map((item: any) => item.imageUrl) || [];
                const updatedUrls = [...uploadedUrls, ...newUrls];
                setUploadedUrls(updatedUrls);
                onUploadSuccess(updatedUrls);

                toast({
                    title: 'Успех',
                    description: `Загружено файлов: ${newUrls.length}`,
                });
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Ошибка при загрузке файлов',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            toast({
                title: 'Ошибка',
                description: 'Ошибка при загрузке файлов',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedPreviews = previewList.filter((_, i) => i !== index);
        const updatedUrls = uploadedUrls.filter((_, i) => i !== index);

        setPreviewList(updatedPreviews);
        setUploadedUrls(updatedUrls);
        onUploadSuccess(updatedUrls);
    };

    return (
        <div
            className={cn(
                'relative border border-dashed border-gray-300 rounded-xl p-5 cursor-pointer',
                className
            )}
            onClick={handleClick}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {previewList.length === 0 && !isUploading && (
                <div className="text-center text-sm text-gray-500 h-20 flex justify-center items-center">
                    Нажмите, чтобы загрузить изображения
                </div>
            )}

            <div className="flex flex-wrap gap-3 mt-2">
                {previewList.map((previewUrl, index) => (
                    <div
                        key={index}
                        className="relative w-40 h-40 rounded-lg border border-gray-200 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                        <Button
                            size={"icon"}
                            variant={"customOutline"}
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1"
                        >
                            ✕
                        </Button>
                    </div>
                ))}
            </div>

            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
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
            )}
        </div>
    );
};

export default MultiImageUploader;
