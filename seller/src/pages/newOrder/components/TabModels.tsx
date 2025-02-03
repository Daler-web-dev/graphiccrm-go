import React from "react";
import { cn } from "@/lib/utils";
import { useStateManager } from "@/contexts/useStateContext";
import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/models/products";
import { SelectedProductPosition } from "./SelectedProductsPosition";
import { v4 as uuidv4 } from 'uuid';

interface Props {
    className?: string;
}

export const TabModels: React.FC<Props> = ({ className }) => {
    const {
        filteredProducts,
        setSelectedProducts,
        selectedProduct,
        setSelectedProduct,
        loading,
    } = useStateManager();

    const handleProductClick = (product: IProduct) => {
        const newProduct = { ...product, id: uuidv4(), position: { upDown: 0, leftRight: 0 } };

        setSelectedProducts((prevSelectedProducts) => [...prevSelectedProducts, newProduct]);
        setSelectedProduct(newProduct);
    };

    return (
        <div className={cn("w-[350px] pt-2 relative", className)}>
            {loading ? (
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-20 whitespace-nowrap" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex gap-2 overflow-x-scroll">
                        {filteredProducts.map((product) => (
                            <img
                                key={product.id}
                                src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                                alt={product.name}
                                className={cn(
                                    "w-20 h-20 aspect-square border border-gray-200 rounded-xl bg-gray-100 cursor-pointer",
                                )}
                                onClick={() => handleProductClick(product)}
                            />
                        ))}
                    </div>

                    {selectedProduct && <SelectedProductPosition />}
                </>
            )}
        </div>
    );
};
