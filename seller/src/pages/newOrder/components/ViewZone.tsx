import { useStateManager } from "@/contexts/useStateContext";

export const ViewZone = () => {
    const { formMethods, selectedProducts, setSelectedProduct } = useStateManager();
    const { width, height, arc: rounded } = formMethods.watch();

    return (
        <div className="flex flex-col justify-center items-center relative">
            {rounded !== 0 && (
                <div
                    style={{
                        width: width + "px",
                        height: rounded + "px",
                        borderStartStartRadius: rounded + "px",
                        borderStartEndRadius: rounded + "px",
                        border: "1px solid #000",
                    }}
                />
            )}

            <div
                style={{
                    width: width + "px",
                    height: height + "px",
                    border: "1px solid #000",
                    position: "relative",
                }}
            >
                {selectedProducts.map((product) => (
                    <img
                        key={product.id}
                        src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                        alt={product.name}
                        className="aspect-square border border-gray-200 rounded-xl bg-gray-100 absolute cursor-pointer"
                        style={{
                            width: `${product?.width}px` || 0,
                            height: `${product?.height}px` || 0,
                            top: product?.position?.upDown || 0,
                            left: product?.position?.leftRight || 0,
                        }}
                        onClick={() => setSelectedProduct(product)}
                    />
                ))}
            </div>
        </div>
    );
};
