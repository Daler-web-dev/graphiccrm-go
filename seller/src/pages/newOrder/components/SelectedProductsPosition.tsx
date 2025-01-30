import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useStateManager } from '@/contexts/useStateContext';
import { X } from 'lucide-react';

interface Props {
    className?: string;
}

export const SelectedProductPosition: React.FC<Props> = ({ className }) => {
    const { setSelectedProducts, selectedProduct, setSelectedProduct } = useStateManager();
    const [formData, setFormData] = useState<Record<string, number>>({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    });

    useEffect(() => {
        if (selectedProduct?.position) {
            setFormData(selectedProduct.position);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (!selectedProduct?.id) return;

        const updatedProduct = { ...selectedProduct, position: formData };

        setSelectedProducts((prevProducts) => {
            const existingProductIndex = prevProducts.findIndex((prod) => prod.id === selectedProduct.id);

            if (existingProductIndex !== -1) {
                const updatedProducts = [...prevProducts];
                updatedProducts[existingProductIndex] = updatedProduct;
                return updatedProducts;
            }

            return [...prevProducts, updatedProduct];
        });
    }, [formData]);

    const handleRemoveProduct = () => {
        setSelectedProducts((prevProducts) =>
            prevProducts.filter((prod) => prod.id !== selectedProduct.id)
        );
        setSelectedProduct(null)
    };

    const handleInputChange = (key: string, value: number) => {
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    };

    return (
        <div className={cn(className)}>
            <form className="h-full flex flex-col justify-between">
                <div className="flex flex-col items-start gap-4">
                    <div className="w-full flex justify-between items-center my-2">
                        <h2 className="font-semibold text-base">Позиция</h2>
                        <X size={16} className="cursor-pointer" onClick={handleRemoveProduct} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <label htmlFor="top" className="flex flex-col items-start">
                            <span>Top</span>
                            <input
                                type="number"
                                id="top"
                                value={formData.top || 0}
                                onChange={(e) => handleInputChange('top', Number(e.target.value))}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                        <label htmlFor="left" className="flex flex-col items-start">
                            <span>Left</span>
                            <input
                                type="number"
                                id="left"
                                value={formData.left || 0}
                                onChange={(e) => handleInputChange('left', Number(e.target.value))}
                                className="border rounded-md p-1 w-full"
                            />
                        </label>
                        <label htmlFor="right" className="w-full flex flex-col items-start">
                            <span>Right</span>
                            <input
                                type="number"
                                id="right"
                                value={formData.right || 0}
                                onChange={(e) => handleInputChange('right', Number(e.target.value))}
                                className="w-full border rounded-md p-1"
                            />
                        </label>
                        <label htmlFor="bottom" className="w-full flex flex-col items-start">
                            <span>Bottom</span>
                            <input
                                type="number"
                                id="bottom"
                                value={formData.bottom || 0}
                                onChange={(e) => handleInputChange('bottom', Number(e.target.value))}
                                className="w-full border rounded-md p-1"
                            />
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};
