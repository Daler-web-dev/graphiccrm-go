import { LoaderTable } from "@/components/custom/LoaderTable";
import Pagination from "@/components/custom/Pagination";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { IEmployee } from "@/types/employees";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Employees: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<IEmployee[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);


	const loadPageData = async (page: number) => {
		setLoading(true);
		const res = await getRequest({ url: `/users?page=${page}&limit=10` });

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
		<>
			<Card>
				<CardHeader className="flex justify-between items-center">
					<div className="w-full flex flex-col justify-start items-start gap-1">
						<CardTitle>Список агентов</CardTitle>
						<CardDescription>
							Список действующих агентов
						</CardDescription>
					</div>
					<Input
						placeholder="Поиск..."
						className="max-w-[300px] px-10"
					/>
				</CardHeader>
				<CardContent>
					{loading ? (
						<LoaderTable />
					) : (
						<Table>
							<TableHeader>
								<TableRow className="border-none hover:bg-white">
									<TableHead>№</TableHead>
									<TableHead>Логин</TableHead>
									<TableHead>Роль</TableHead>
									<TableHead className="text-right">Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.length > 0 ? data.map((agent, idx) => (
									<TableRow className="text-left">
										<TableCell>{idx + 1}</TableCell>
										<TableCell>{agent.username}</TableCell>
										<TableCell>{agent.role}</TableCell>
										<TableCell className="text-right">
											<Button onClick={() => navigate(`/employees/${agent.id}`)}>Просмотр</Button>
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
					)}
				</CardContent>
			</Card>
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
			/>
		</>
	);
};
