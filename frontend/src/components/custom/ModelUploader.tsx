import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ModelUploaderProps {
    previewPlaceholder?: string;
    onUploadSuccess: (url: string) => void;
    className?: string;
}

/**
 * Компонент для загрузки и предпросмотра 3D-модели (.glb/.gltf).
 * По выбору файла создаёт obj URL для preview, затем загружает на сервер и вызывает onUploadSuccess с полученным URL.
 */
export const ModelUploader: React.FC<ModelUploaderProps> = ({
    previewPlaceholder,
    onUploadSuccess,
    className,
}) => {
    const [modelPreview, setModelPreview] = useState<string | null>(previewPlaceholder || null);
    const [isUploading, setIsUploading] = useState(false);
    const objectUrlRef = useRef<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Создаём временный URL для предпросмотра
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setModelPreview(url);

        // Загружаем на сервер
        setIsUploading(true);
        const formData = new FormData();
        formData.append('model', file);

        axios.post(
            `${import.meta.env.VITE_API_URL}/upload`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    onUploadSuccess(res.data.data.modelUrl);
                    toast({ title: 'Успех', description: 'Модель загружена' });
                } else {
                    toast({
                        title: 'Ошибка',
                        description: 'Ошибка при загрузке модели',
                        variant: 'destructive',
                    });
                }
            })
            .catch(err => {
                console.error('Upload error', err);
                toast({ title: 'Ошибка', description: 'Ошибка при загрузке модели', variant: 'destructive' });
            })
            .finally(() => setIsUploading(false));
    };

    // Очистка созданного object URL
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        };
    }, []);

    return (
        <div className={cn('relative border border-gray-200 rounded p-2', className)}>
            <div className="w-full h-64 bg-gray-100">
                {modelPreview ? (
                    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <Suspense fallback={null}>
                            <ModelPreview src={modelPreview} />
                        </Suspense>
                        <OrbitControls enableRotate enableZoom enablePan />
                    </Canvas>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Загрузите .glb/.gltf файл
                    </div>
                )}
            </div>
            <input
                type="file"
                accept=".glb,.gltf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-cOrange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

// Вспомогательный компонент для предпросмотра модели
function ModelPreview({ src }: { src: string }) {
    const { scene } = useGLTF(src);
    return <primitive object={scene} />;
}
