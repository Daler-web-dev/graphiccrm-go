import { LoaderTable } from "@/components/custom/LoaderTable";
import { OrdersQuery } from "@/components/custom/OrdersQuery";
import Pagination from "@/components/custom/Pagination";
import { Button } from "@/components/ui/button";
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
import { getRequest, postRequest } from "@/lib/apiHandlers";
import { cn, formatPrice } from "@/lib/utils";
import { IOrder } from "@/models/order";
import { Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Orders: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<Array<IOrder>>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [isStatusChanged, setIsStatusChanged] = useState(false);
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

	const handleStatusChange = async (id: string, status: string) => {
		const res = await postRequest({ url: `/orders/${id}/${status.split('ed')[0]}` });

		if (res.status === 200 || res.status === 201) {
			toast({
				title: 'Успешно',
				description: 'Статус успешно изменен',
			})
			setIsStatusChanged(!isStatusChanged);
		} else {
			toast({
				title: 'Ошибка',
				description: 'Произошла ошибка при изменении статуса',
				variant: 'destructive',
			})
		}
	};

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
									<TableRow className="hover:bg-white border-none">
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
										<TableRow className='text-left cursor-pointer' key={index} onClick={() => navigate(`/orders/${item?.id}`)}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>{item?.id}</TableCell>
											<TableCell>{item?.createdAt.split('T')[0]}</TableCell>
											<TableCell>{formatPrice(item?.totalPrice)}</TableCell>
											<TableCell>{item?.paymentMethod === 'cash' ? 'Наличными' : item?.paymentMethod === "transfer" ? "Переводом" : "Картой"}</TableCell>
											<TableCell className={cn(item.status === "accepted" ? "text-cDarkBlue" : "text-red-600")}>
												{item.status !== "pending" ?
													item.status === "accepted" ? "Принят" : "Отклонен" : (
														<div className='z-10'>
															<Button
																variant="custom"
																onClick={(e) => {
																	e.stopPropagation();
																	handleStatusChange(item.id, 'accepted')
																}}
																className="bg-green-500 text-white py-2 px-3 rounded-lg"
															>
																<Check />
															</Button>
															<Button
																variant="custom"
																onClick={(e) => {
																	e.stopPropagation();
																	handleStatusChange(item.id, 'rejected')
																}}
																className="bg-red-500 text-white py-2 px-3 rounded-lg ml-1"
															>
																<X />
															</Button>
														</div>
													)
												}
											</TableCell>
										</TableRow>
									)) : (
										<TableRow>
											<TableCell className="text-base text-center rounded-xl" colSpan={7}>
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
