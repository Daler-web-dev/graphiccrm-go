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
import { useDebounce } from "@/hooks/useDebounce";
import { getRequest } from "@/lib/apiHandlers";
import { IEmployee } from "@/models/employees";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Employees: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<IEmployee[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState<string>('');
	const searchDebounced = useDebounce(search, 500);


	const loadPageData = async (page: number, search?: string) => {
		setLoading(true);
		if (search === '') {
			const res = await getRequest({ url: `/users?page=${page}&limit=10&` });

			if (res.status === 200 || res.status === 201) {
				setData(res.data.data);
				setTotalPages(res.data.pagination.totalPages);
				setLoading(false);
			} else {
				toast({
					title: 'Ошибка',
					description: 'Произошла ошибка при загрузке сотрудников',
					variant: 'destructive',
				});
			}
		} else {
			const res = await getRequest({ url: `/users/search?q=${search}` });

			if (res.status === 200 || res.status === 201) {
				setData(res.data.data);
				setTotalPages(1);
				setLoading(false);
			} else {
				toast({
					title: 'Ошибка',
					description: 'Произошла ошибка при загрузке заказов',
					variant: 'destructive',
				});
			}
		}
	};

	useEffect(() => {
		loadPageData(currentPage, searchDebounced);
	}, [currentPage, searchDebounced]);

	return (
		<div className="relative">
			<Button onClick={() => navigate("/employees/new")} className="px-10 absolute -top-20 right-5">Добавить сотрудника</Button>
			<Card>
				<CardHeader className="flex justify-between items-center">
					<div className="w-full flex flex-col justify-start items-start gap-1">
						<CardTitle>Список сотрудников</CardTitle>
						<CardDescription>
							Список действующих сотрудников
						</CardDescription>
					</div>
					<Input
						placeholder="Поиск..."
						className="max-w-[300px] px-10"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</CardHeader>
				<CardContent>
					{loading ? (
						<LoaderTable />
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow className="border-none hover:bg-white">
										<TableHead>№</TableHead>
										<TableHead>Логин</TableHead>
										<TableHead>Роль</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data && data.length > 0 ? data.map((agent, idx) => (
										<TableRow className="text-left cursor-pointer" key={idx} onClick={() => navigate(`/employees/${agent.id}`)}>
											<TableCell>{idx + 1}</TableCell>
											<TableCell className='flex gap-1 items-center'>
												<img src={agent.image !== "" ? import.meta.env.VITE_API_URL + "/" + agent.image : "/images/humanPlaceholder.png"} alt="product image" loading='lazy' className='w-10 h-10 object-cover rounded-lg border border-gray-200' />
												{agent.username}
											</TableCell>
											<TableCell>{agent?.role === "admin" ? "Админ" : agent?.role === "manager" ? "Работник склада" : "Продавец"}</TableCell>
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
