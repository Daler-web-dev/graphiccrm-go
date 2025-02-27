import { LoaderTable } from "@/components/custom/LoaderTable";
import { OrdersQuery } from "@/components/custom/OrdersQuery";
import Pagination from "@/components/custom/Pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { getRequest } from "@/lib/apiHandlers";
import { cn, formatPrice } from "@/lib/utils";
import { IOrder } from "@/models/order";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Orders: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<Array<IOrder>>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [queryParams, setQueryParams] = useState({});


	const loadPageData = async (page: number, params: any) => {
		setLoading(true);
		const res = await getRequest({ url: `/orders?page=${page}&limit=10`, params: params });

		if (res.status === 200 || res.status === 201) {
			setData(res.data.data);
			setTotalPages(res.data.pagination.totalPages);
			setLoading(false);
		} else {
			toast({
				title: 'Ошибка',
				description: 'Произошла ошибка при загрузке заказов',
				variant: 'destructive',
			});
		}
	};

	useEffect(() => {
		loadPageData(currentPage, queryParams);
	}, [currentPage, queryParams]);

	return (
		<div className="w-full relative">
			<Card>
				<CardHeader className="flex justify-between items-center">
					<div className="flex flex-col items-start">
						<CardTitle>Заказы</CardTitle>
						<CardDescription>История заказов</CardDescription>
					</div>
					<OrdersQuery setParams={setQueryParams} />
				</CardHeader>
				<CardContent>
					{loading ? (
						<LoaderTable />
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-white border-none text-base">
										<TableHead>#</TableHead>
										<TableHead>Номер</TableHead>
										<TableHead>Дата</TableHead>
										<TableHead>Сумма</TableHead>
										<TableHead>Тип оплаты</TableHead>
										<TableHead>Статус</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.length > 0 ? data.map((item, index) => (
										<TableRow
											className='text-left cursor-pointer text-base'
											key={index}
											onClick={() => navigate(`/orders/${item?.id}`)}
										>
											<TableCell>{index + 1}</TableCell>
											<TableCell>№ {item?.id}</TableCell>
											<TableCell>{item?.createdAt.split('T')[0]}</TableCell>
											<TableCell>{formatPrice(item?.totalPrice)}</TableCell>
											<TableCell>{item?.paymentMethod === 'cash' ? 'Наличными' : item?.paymentMethod === "transfer" ? "Переводом" : "Картой"}</TableCell>
											<TableCell
												className={cn(item?.status === "delivered" ? "text-green-600" : item?.status === "in_production" ? "text-cDarkBlue" : item?.status === "pending" ? "text-gray-400" : item?.status === "accepted" ? "text-cLightBlue" : "text-red-600")}
											>{item?.status === "delivered" ? "Доставлен" : item?.status === "in_production" ? "В производстве" : item?.status === "pending" ? "В обработке" : item?.status === "accepted" ? "Принят" : "Отклонен"}</TableCell>
										</TableRow>
									)) : (
										<TableRow>
											<TableCell className="text-base text-center rounded-xl" colSpan={6}>
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
				</CardContent>
			</Card>
		</div>
	);
};
