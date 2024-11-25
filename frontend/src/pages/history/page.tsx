import { HistoryList } from "@/components/custom/HistoryList";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export const History: React.FC = () => {
	const orders = [
		{
			id: 3245,
			client: {
				name: "Иван Кузьма",
				contact: "+998979303666",
				address: "Улугбек, сзади магазина",
			},
			orderNumber: 123456,
			date: "2022-10-01",
			total: 3000000,
			paymentType: "Наличные",
			status: "Выполнен",
		},
		{
			id: 2345,
			client: {
				name: "Алексей",
				contact: "+998907803666",
				address: "Яшнабад, 1-й проезд, 8-й дом",
			},
			orderNumber: 1324567,
			date: "2022-01-11",
			total: 13220000,
			paymentType: "Перевод",
			status: "В процессе",
		},
		{
			id: 3124536,
			client: {
				name: "Максим",
				contact: "+998977703666",
				address: "Хамид Олимов, 31",
			},
			orderNumber: 756343,
			date: "2022-07-19",
			total: 6600000,
			paymentType: "Долг",
			status: "В ожидании",
		},
		{
			id: 123,
			client: {
				name: "Андрей",
				contact: "+998987703666",
				address: "Юнусабад, 18-й квартал, 3-й дом",
			},
			orderNumber: 123456,
			date: "2022-10-01",
			total: 3000000,
			paymentType: "Наличные",
			status: "Выполнен",
		},
		{
			id: 456,
			client: {
				name: "Артур",
				contact: "+998937703666",
				address: "М.Улугбек, 32",
			},
			orderNumber: 1324567,
			date: "2022-01-11",
			total: 13220000,
			paymentType: "Перевод",
			status: "В процессе",
		},
		{
			id: 789,
			client: {
				name: "Николай",
				contact: "+998917703666",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 756343,
			date: "2022-07-19",
			total: 6600000,
			paymentType: "Долг",
			status: "В ожидании",
		},
		{
			id: 101,
			client: {
				name: "Вадим",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 123456,
			date: "2022-10-01",
			total: 3000000,
			paymentType: "Наличные",
			status: "Выполнен",
		},
		{
			id: 202,
			client: {
				name: "Дмитрий",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 1324567,
			date: "2022-01-11",
			total: 13220000,
			paymentType: "Перевод",
			status: "В процессе",
		},
		{
			id: 303,
			client: {
				name: "Егор",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 756343,
			date: "2022-07-19",
			total: 6600000,
			paymentType: "Долг",
			status: "В ожидании",
		},
		{
			id: 404,
			client: {
				name: "Павел",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 123456,
			date: "2022-10-01",
			total: 3000000,
			paymentType: "Наличные",
			status: "Выполнен",
		},
		{
			id: 505,
			client: {
				name: "Виктор",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 1324567,
			date: "2022-01-11",
			total: 13220000,
			paymentType: "Перевод",
			status: "В процессе",
		},
		{
			id: 606,
			client: {
				name: "Анатолий",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 756343,
			date: "2022-07-19",
			total: 6600000,
			paymentType: "Долг",
			status: "В ожидании",
		},
	];
	const debts = [
		{
			id: 707,
			client: {
				name: "Игорь",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 912345,
			date: "2022-02-22",
			total: 4200000,
			paymentType: "Карта",
			status: "Выполнен",
		},
		{
			id: 808,
			client: {
				name: "Сергей",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 456789,
			date: "2022-03-03",
			total: 5400000,
			paymentType: "Наличные",
			status: "В ожидании",
		},
		{
			id: 909,
			client: {
				name: "Александр",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 135792,
			date: "2022-04-04",
			total: 2700000,
			paymentType: "Перевод",
			status: "В процессе",
		},
		{
			id: 1010,
			client: {
				name: "Аркадий",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 246801,
			date: "2022-05-05",
			total: 8100000,
			paymentType: "Долг",
			status: "Выполнен",
		},
		{
			id: 1111,
			client: {
				name: "Григорий",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 357912,
			date: "2022-06-06",
			total: 9900000,
			paymentType: "Карта",
			status: "В ожидании",
		},
		{
			id: 1212,
			client: {
				name: "Юрий",
				contact: "+998778789789",
				address: "Яшнабад, 2-й проезд, 12-й дом",
			},
			orderNumber: 467890,
			date: "2022-07-07",
			total: 6300000,
			paymentType: "Наличные",
			status: "В процессе",
		},
	];
	return (
		<div className="w-full relative">
			<Tabs defaultValue="orders">
				<TabsList className="absolute -top-16 right-0">
					<TabsTrigger value="orders">Заказы</TabsTrigger>
					<TabsTrigger value="debts">Долги</TabsTrigger>
				</TabsList>
				<TabsContent value="orders">
					<HistoryList
						title="История заказов"
						description="Здесь вы можете просмотреть историю заказов"
						data={orders}
					/>
				</TabsContent>
				<TabsContent value="debts">
					<HistoryList
						title="История заказов"
						description="Здесь вы можете просмотреть историю заказов"
						data={debts}
					/>
				</TabsContent>
			</Tabs>
			<Card className="w-full mt-5">
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="font-medium text-xl text-cLightBlue">
									Итого количество
								</TableHead>
								<TableHead className="font-medium text-xl text-cLightBlue">
									Итого сумма
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow className="text-left hover:bg-transparent">
								<TableCell className="font-bold text-2xl">
									{orders.length}
								</TableCell>
								<TableCell className="font-bold text-2xl">
									{orders.reduce(
										(acc, order) => acc + order.total,
										0
									)}{" "}
									сум
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};
