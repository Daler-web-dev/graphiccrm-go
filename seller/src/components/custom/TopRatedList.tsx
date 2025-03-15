import { getRequest } from "@/lib/apiHandlers";
import { useEffect, useState } from "react";
import { LoaderTable } from "./LoaderTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { IStatistics } from "@/models/stats";

export default function TopRatedList() {
    const navigate = useNavigate();
    const [data, setData] = useState<IStatistics>({ top_clients: [], top_products: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchStats = async () => {
            const res = await getRequest({ url: "/statistics/dashboard" });

            if (res.status === 200 || res.status === 201) {
                setLoading(false);
                setData(res.data);
            } else {
                toast({
                    title: "Ошибка",
                    description: "Произошла ошибка при загрузке статистики",
                })
            }
        }

        fetchStats();
    }, [])

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-5">
            <div className="rounded-md border p-4 bg-white shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Топ клиенты</h2>
                </div>
                {loading ? (
                    <LoaderTable />
                ) : (
                    <Table className="border-spacing-y-2 border-separate">
                        <TableHeader>
                            <TableRow className="border-none hover:bg-white">
                                <TableHead>#</TableHead>
                                <TableHead>Имя</TableHead>
                                <TableHead>Кол-во заказов</TableHead>
                                <TableHead>Сумма заказов</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data?.top_clients?.length > 0 ? data?.top_clients.map((client, idx) => (
                                <TableRow
                                    className='text-left cursor-pointer bg-[#F2F2F2] hover:bg-[#F2F2F2]/80'
                                    key={idx}
                                    onClick={() => navigate(`/clients/${client?.client_id}`)}
                                >
                                    <TableCell className="text-base rounded-s-xl relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{idx + 1}</TableCell>
                                    <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{client?.client_name}</TableCell>
                                    <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{client?.order_count} шт.</TableCell>
                                    <TableCell className="text-base rounded-e-xl">{formatPrice(client?.total_spent)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell className="text-base text-center rounded-xl" colSpan={4}>
                                        Нет данных по вашему запросу
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className="rounded-md border p-4 bg-white shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Топ продукты</h2>
                </div>
                {loading ? (
                    <LoaderTable />
                ) : (
                    <Table className="border-spacing-y-2 border-separate">
                        <TableHeader>
                            <TableRow className="border-none hover:bg-white">
                                <TableHead>#</TableHead>
                                <TableHead>Наименование</TableHead>
                                <TableHead>Кол-во продаж</TableHead>
                                <TableHead>Сумма продаж</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data?.top_products?.length > 0 ? data?.top_products.map((product, idx) => (
                                <TableRow
                                    className='text-left cursor-pointer bg-[#F2F2F2] hover:bg-[#F2F2F2]/80'
                                    key={idx}
                                    onClick={() => navigate(`/products/${product?.product_id}`)}
                                >
                                    <TableCell className="text-base rounded-s-xl relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{idx + 1}</TableCell>
                                    <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{product?.product_name}</TableCell>
                                    <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{product?.units_sold} шт.</TableCell>
                                    <TableCell className="text-base rounded-e-xl">{formatPrice(product?.total_sold)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell className="text-base text-center rounded-xl" colSpan={4}>
                                        Нет данных по вашему запросу
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
