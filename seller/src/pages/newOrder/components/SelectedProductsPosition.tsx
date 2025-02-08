import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStateManager } from "@/contexts/useStateContext";
import { X } from "lucide-react";

interface Props {
    className?: string;
}

export const SelectedProductPosition: React.FC<Props> = ({ className }) => {
    const { setSelectedProducts, selectedProduct, setSelectedProduct, selectedProducts } =
        useStateManager();
    const [formData, setFormData] = useState<any>({
        upDown: 0,
        leftRight: 0,
    });

    useEffect(() => {
        if (!selectedProduct?.id) return;

        const currentProduct = selectedProducts.find((prod) => prod.id === selectedProduct.id);

        if (currentProduct?.position) {
            setFormData(currentProduct.position);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (!selectedProduct?.id) return;

        const updatedProduct = { ...selectedProduct, position: formData };

        setSelectedProducts((prevProducts) => {
            return prevProducts.map((prod) => (prod.id === selectedProduct.id ? updatedProduct : prod));
        });
    }, [formData]);

    const handleRemoveProduct = () => {
        setSelectedProducts((prevProducts) =>
            prevProducts.filter((prod) => prod.id !== selectedProduct.id)
        );
        setSelectedProduct(null);
    };

    const handleInputChange = (key: "upDown" | "leftRight", value: number) => {
        setFormData((prevData: any) => ({ ...prevData, [key]: value }));
    };

    const handleSideChange = (side: string) => {
        setFormData((prevData: any) => ({ ...prevData, side }));
    };

    return (
        <div className={cn(className)}>
            <div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Высота</span>
                    <p className="text-sm font-medium">{selectedProduct?.height} см.</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Ширина</span>
                    <p className="text-sm font-medium">{selectedProduct?.width} см.</p>
                </div>
            </div>
            {selectedProduct.unit === "piece" ? (
                <form className="h-full flex flex-col justify-between">
                    <div className="flex flex-col items-start gap-4">
                        <div className="w-full flex justify-between items-center my-2">
                            <h2 className="font-semibold text-base">Позиция</h2>
                            <X size={16} className="cursor-pointer" color="red" onClick={handleRemoveProduct} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label htmlFor="upDown" className="flex flex-col items-start">
                                <span>Вверх/вниз</span>
                                <input
                                    type="number"
                                    id="upDown"
                                    value={formData.upDown}
                                    onChange={(e) => handleInputChange("upDown", Number(e.target.value))}
                                    className="border rounded-md p-1 w-full"
                                />
                            </label>
                            <label htmlFor="leftRight" className="flex flex-col items-start">
                                <span>Влево/Вправо</span>
                                <input
                                    type="number"
                                    id="leftRight"
                                    value={formData.leftRight}
                                    onChange={(e) => handleInputChange("leftRight", Number(e.target.value))}
                                    className="border rounded-md p-1 w-full"
                                />
                            </label>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mt-2 flex flex-col items-start">
                    <div className="w-full flex justify-between items-center my-2">
                        <h2 className="font-semibold text-base">Позиция</h2>
                        <X size={16} className="cursor-pointer" color="red" onClick={handleRemoveProduct} />
                    </div>
                    <select
                        className="border rounded-md p-1 w-full"
                        value={formData.side}
                        onChange={(e) => handleSideChange(e.target.value)}
                    >
                        <option hidden>Выберите сторону</option>
                        <option value={"topSide"}>Верх</option>
                        <option value={"bottomSide"}>Низ</option>
                        <option value={"leftSide"}>Лево</option>
                        <option value={"rightSide"}>Право</option>
                    </select>
                </div>
            )}
        </div>
    );
};