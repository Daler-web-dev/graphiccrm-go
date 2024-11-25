import { AddCategoryForm } from "@/components/custom/AddCategory";
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
import { Edit, Trash2 } from "lucide-react";
import React from "react";

export const Categories: React.FC = () => {
	const categories = [
		{ id: 1, title: "Категория 1" },
		{ id: 2, title: "Категория 2" },
		{ id: 3, title: "Категория 3" },
		{ id: 4, title: "Категория 4" },
	];

	return (
		<Card>
			<CardHeader className="flex flex-col justify-center items-start">
				<CardTitle>Категории</CardTitle>
				<CardDescription>Список категорий</CardDescription>
				<AddCategoryForm />
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Наименование</TableHead>
							<TableHead className="text-right">
								Действия
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories.map((category) => (
							<TableRow key={category.id}>
								<TableCell className="text-left">
									{category.title}
								</TableCell>
								<TableCell className="flex justify-end gap-2">
									<Button
										variant="secondary"
										size="icon"
										onClick={() => {
											console.log(category);
										}}
									>
										<Edit className="h-4 w-4 text-cLightBlue" />
									</Button>
									<Button
										variant="secondary"
										size="icon"
										onClick={() => {
											console.log(category);
										}}
									>
										<Trash2 className="h-4 w-4 text-red-600" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
