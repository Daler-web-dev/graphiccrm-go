import React, { useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '@/lib/apiHandlers';
import Pagination from '@/components/custom/Pagination';
import { LoaderTable } from '@/components/custom/LoaderTable';

interface Props {
    className?: string;
    id: string;
}

interface IOrder {
    order_number: string;
    date: string;
    overall_count: number;
    overall_sum: number;
    client_fullname: string;
    client_address: string;
    status: string;
}

const tabs = [
    { value: 'PURCHASE', label: 'Продажи' },
    { value: 'RETURN', label: 'Возвраты' },
]

export const EmployeesHistory: React.FC<Props> = ({ id }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [data, setData] = React.useState<IOrder[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [tab, setTab] = React.useState<string>('PURCHASE');

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            const res = await getRequest({ url: `/order?page=${currentPage}&limit=10&type=${tab}&agentId=${id}` });

            if (res.status === 200 || res.status === 201) {
                setData(res.data.data);
                setTotalPages(Math.ceil(res.data.data.length / 10 || 1));
                setLoading(false);
            }
        };

        loadPageData();
    }, [currentPage, tab]);

    return (
        <div>
            <div className="flex border-b">
                {tabs.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setTab(item.value)}
                        className={`w-full px-4 py-2 text-lg font-medium transition-colors duration-300
                       ${tab === item.value
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-gray-600"
                            }
                     `}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className='mt-5'>
                    <LoaderTable />
                </div>
            ) : (
                <>
                    <Table className="border-spacing-y-2 border-separate">
                        <TableHeader>
                            <TableRow className="border-none hover:bg-white">
                                <TableHead className="text-left text-base font-semibold">#</TableHead>
                                <TableHead className="text-left text-base font-semibold">Номер заказа</TableHead>
                                <TableHead className="text-left text-base font-semibold">Количество</TableHead>
                                <TableHead className="text-left text-base font-semibold">Сумма</TableHead>
                                <TableHead className="text-left text-base font-semibold">Клиент</TableHead>
                                <TableHead className="text-left text-base font-semibold">Дата</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? data.map((order, idx) => (
                                <TableRow
                                    key={idx}
                                    className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none cursor-pointer"
                                    onClick={() => {
                                        navigate(`/orders/${order.order_number}`)
                                    }}
                                >
                                    <TableCell className="text-base rounded-s-xl relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="text-base relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{order.order_number}</TableCell>
                                    <TableCell className="text-base relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{order.overall_count}</TableCell>
                                    <TableCell className="text-base relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{formatPrice(order.overall_sum)}</TableCell>
                                    <TableCell className="text-base relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{order.client_fullname}</TableCell>
                                    <TableCell className="text-base rounded-e-xl">{order.date.split('T')[0]}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none">
                                    <TableCell className="text-base text-center rounded-xl" colSpan={8}>
                                        Нет данных по вашему запросу
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};