import { LoaderTable } from "@/components/custom/LoaderTable";
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
import { getRequest } from "@/lib/apiHandlers";
import { IOrder } from "@/types/order";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Orders: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<Array<IOrder>>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);


	const loadPageData = async (page: number) => {
		setLoading(true);
		const res = await getRequest({ url: `/orders?page=${page}&limit=10` });

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
		loadPageData(currentPage);
	}, [currentPage]);

	return (
		<div className="w-full relative">
			<Card>
				<CardHeader className="flex flex-col items-start">
					<CardTitle className="text-3xl font-bold text-cBlack">Заказы</CardTitle>
					<CardDescription className="text-cLightBlue">История заказов</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<LoaderTable />
					) : (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-white border-none">
									<TableHead>#</TableHead>
									<TableHead>Номер</TableHead>
									<TableHead>Дата</TableHead>
									<TableHead>Сумма</TableHead>
									<TableHead>Тип оплаты</TableHead>
									<TableHead>Статус</TableHead>
									<TableHead>Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.length > 0 ? data.map((item, index) => (
									<TableRow className='text-left' onClick={() => navigate(`/orders/${item.id}`)}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{item.id}</TableCell>
										<TableCell>{item.createdAt.split('T')[0]}</TableCell>
										<TableCell>{item.totalPrice}</TableCell>
										<TableCell>{item.paymentMethod}</TableCell>
										{item.status === 'completed' ? <TableCell className='text-cDarkBlue'>{item.status}</TableCell> : item.status === 'in_production' ? <TableCell className='text-cLightBlue'>{item.status}</TableCell> : <TableCell className='text-gray-400'>{item.status}</TableCell>}
										<TableCell><Button>Просмотр</Button></TableCell>
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
					)}
				</CardContent>
			</Card>
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
};
