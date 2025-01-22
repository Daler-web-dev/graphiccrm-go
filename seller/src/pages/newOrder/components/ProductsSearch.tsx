import * as React from "react";
import { getRequest } from "@/lib/apiHandlers";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/hooks/use-toast";
import { LoaderTable } from "@/components/custom/LoaderTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import Pagination from "@/components/custom/Pagination";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface IProduct {
    id: string;
    name: string;
    articul: string;
    unitPrice: number;
    count: number;
    amountInBox: number;
    categoryId: string;
    imagePath: string;
    totalPrice: number;
}

interface ProductSearchProps {
    setValue: (value: { productId: string; quantity: number }[]) => void;
}

export function ProductSearch({ setValue }: ProductSearchProps) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [products, setProducts] = React.useState<IProduct[]>([]);
    const [cart, setCart] = React.useState<{ productId: string; quantity: number }[]>([]);

    const debouncedQuery = useDebounce(query, 500);

    React.useEffect(() => {
        if (!debouncedQuery) {
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            const response = await getRequest({
                url: `/products?q=${debouncedQuery}`,
            });
            if (response.status === 200 || response.status === 201) {
                setProducts(response.data.data);
                setTotalPages(Math.ceil(response.data.total / 10));
                setLoading(false);
            } else {
                toast({
                    title: "Ошибка",
                    description: "Произошла ошибка при загрузке продуктов",
                    variant: "destructive",
                });
            }
        };

        fetchProducts();
    }, [debouncedQuery]);

    const handleAddToCart = (id: string) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.productId === id);
            const product = products.find((item) => item.id === id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.productId === id
                        ? { ...item, quantity: Math.min(item.quantity + 1, product?.count || 0) }
                        : item
                );
            } else {
                return [...prevCart, { productId: id, quantity: 1 }];
            }
        });
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === id
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const handleRemoveFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    };
    setValue(cart)

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по артиклю или названию..."
                className="w-full p-2 border text-sm rounded-lg outline-none bg-[#fafafa]"
            />
            <div>
                {loading ? (
                    <LoaderTable />
                ) : (
                    <>
                        <Table className="border-spacing-y-2 border-separate">
                            <TableHeader>
                                <TableRow className="border-none hover:bg-white">
                                    <TableHead className="text-left text-base font-semibold">#</TableHead>
                                    <TableHead className="text-left text-base font-semibold">Наименование</TableHead>
                                    <TableHead className="text-left text-base font-semibold">Цена</TableHead>
                                    <TableHead className="text-left text-base font-semibold">Кол-во на складе</TableHead>
                                    <TableHead className="text-left text-base font-semibold">Количество</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length > 0 ? (
                                    products.map((item, idx) => {
                                        const cartItem = cart.find((product) => product.productId === item.id);
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none cursor-pointer"
                                            >
                                                <TableCell className="text-base rounded-s-xl">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell className="text-base">{item.name}</TableCell>
                                                <TableCell className="text-base">{formatPrice(item.unitPrice)}</TableCell>
                                                <TableCell className="text-base">{item.count} шт.</TableCell>
                                                <TableCell className="text-base">
                                                    {cartItem ? (
                                                        <div className="space-x-3">
                                                            <input
                                                                type="number"
                                                                value={cartItem.quantity}
                                                                min="1"
                                                                onChange={(e) =>
                                                                    handleQuantityChange(item.id, parseInt(e.target.value))
                                                                }
                                                                className="w-28 p-1 border rounded"
                                                            />
                                                            {cartItem && (
                                                                <Button
                                                                    variant={"destructive"}
                                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                                    size={"icon"}
                                                                >
                                                                    <Trash2 />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant={"custom"}
                                                            onClick={() => handleAddToCart(item.id)}
                                                            className="px-10"
                                                        >
                                                            Добавить
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center bg-gray-100 rounded-xl">
                                            Нет данных по вашему запросу
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
