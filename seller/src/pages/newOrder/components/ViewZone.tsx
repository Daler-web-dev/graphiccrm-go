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
                {selectedProducts.map((product) => {
                    if (product.unit === "piece") {
                        return (
                            <img
                                key={product.id}
                                src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                                alt={product.name}
                                className="aspect-square border border-gray-200 rounded-xl bg-gray-100 absolute cursor-pointer z-10"
                                style={{
                                    width: `${product?.width}px` || 0,
                                    height: `${product?.height}px` || 0,
                                    top: product?.position?.upDown || 0,
                                    left: product?.position?.leftRight || 0,
                                }}
                                onClick={() => setSelectedProduct(product)}
                            />
                        );
                    } else if (product.unit === "meter") {
                        const { side } = product.position || { side: "topSide" };
                        const style: any = {
                            position: "absolute",
                            objectFit: "cover",
                        };

                        switch (side) {
                            case "topSide":
                                style.width = `${width}px`;
                                style.height = `${product.height}px`;
                                style.top = `-${product.height}px`;
                                style.left = "0";
                                break;
                            case "bottomSide":
                                style.width = `${width}px`;
                                style.height = `${product.height}px`;
                                style.bottom = `-${product.height}px`;
                                style.left = "0";
                                break;
                            case "leftSide":
                                style.width = `${product.height}px`;
                                style.height = `${height}px`;
                                style.left = `-${product.height}px`;
                                style.top = "-1px";
                                break;
                            case "rightSide":
                                style.width = `${product.height}px`;
                                style.height = `${height}px`;
                                style.right = `-${product.height}px`;
                                style.top = "-1px";
                                break;
                            default:
                                break;
                        }

                        return (
                            <img
                                key={product.id}
                                src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                                alt={product.name}
                                className="border border-gray-200 bg-gray-100 absolute cursor-pointer"
                                style={style}
                                onClick={() => setSelectedProduct(product)}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};