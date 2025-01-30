import React from "react";
import { cn } from "@/lib/utils";
import { useStateManager } from "@/contexts/useStateContext";
import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/models/products";
import { SelectedProductPosition } from "./SelectedProductsPosition";

interface Props {
    className?: string;
}

export const TabModels: React.FC<Props> = ({ className }) => {
    const { filteredProducts, setSelectedProducts, selectedProduct, setSelectedProduct, loading } = useStateManager();

    const handleProductClick = (product: IProduct) => {
        setSelectedProducts((prevSelectedProducts) => {
            const alreadySelected = prevSelectedProducts.some(
                (selectedProduct) => selectedProduct.id === product.id
            );

            if (alreadySelected) return prevSelectedProducts;

            return [...prevSelectedProducts, product];
        });

        setSelectedProduct(product);
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
                                className={cn("w-20 h-20 aspect-square border border-gray-200 rounded-xl bg-gray-100", selectedProduct?.id === product.id && "border border-cDarkBlue")}
                                onClick={() => handleProductClick(product)}
                            // onDoubleClick={() => {
                            //     if (selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)) {
                            //         setSelectedProducts((prevSelectedProducts) =>
                            //             prevSelectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id)
                            //         );
                            //     }
                            // }}
                            />
                        ))}
                    </div>
                    {selectedProduct && <SelectedProductPosition />}
                </>
            )}
        </div>
    );
};
