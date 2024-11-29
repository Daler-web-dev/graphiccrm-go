import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface ImageUploaderProps {
    register: UseFormRegisterReturn;
    previewPlaceholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ register, previewPlaceholder = '/clientPlaceholder.png' }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(previewPlaceholder);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full relative">
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
                    accept=".webp,.png,.jpg,.jpeg"
                    {...register}
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
};

export default ImageUploader;
