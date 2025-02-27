import { AddCategoryForm } from "@/components/custom/AddCategory";
import DeleteModal from "@/components/custom/DeleteModal";
import { EditCategory } from "@/components/custom/EditCategory";
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
import { ICategory } from "@/models/categories";
import { Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export const Categories: React.FC = () => {
	const [data, setData] = useState<Array<ICategory>>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);

	const loadPageData = async (page: number) => {
		setLoading(true);
		const res = await getRequest({
			url: `/categories?page=${page}&limit=10`,
		});

		if (res.status === 200 || res.status === 201) {
			setData(res.data.data);
			setTotalPages(res.data.pagination.totalPages);
			setLoading(false);
		} else {
			toast({
				title: "Ошибка",
				description: "Произошла ошибка при загрузке категорий",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		loadPageData(currentPage);
	}, [currentPage]);

	return (
		<div className="relative">
			<Card>
				<CardHeader className="flex flex-col justify-center items-start">
					<CardTitle>Категории</CardTitle>
					<CardDescription>Список категорий.</CardDescription>
					<AddCategoryForm onUpdate={() => loadPageData(currentPage)}>
						<Button
							type="submit"
							className="absolute right-5 -top-20"
						>
							Добавить категорию
						</Button>
					</AddCategoryForm>
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
										<TableHead>Наименование</TableHead>
										<TableHead className="text-right">
											Действия
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.length > 0 ? (
										data.map((category, idx) => (
											<TableRow key={category.id}>
												<TableCell className="w-10 text-left">
													{idx + 1}
												</TableCell>
												<TableCell className="text-left">
													{category.name}
												</TableCell>
												<TableCell className="flex justify-end gap-2">
													<EditCategory
														onUpdate={() => loadPageData(currentPage)}
														categoryId={category.id}
													>
														<Button
															variant="secondary"
															size="icon"
														>
															<Edit className="h-4 w-4 text-cLightBlue" />
														</Button>
													</EditCategory>
													<DeleteModal
														item={category}
														path="categories"
														onUpdate={() => loadPageData(currentPage)}
													>
														<Button
															variant="secondary"
															size="icon"
														>
															<Trash2 className="h-4 w-4 text-red-600" />
														</Button>
													</DeleteModal>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												className="text-base text-center rounded-xl"
												colSpan={3}
											>
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
