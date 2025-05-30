import { HandleStatusChangeDialog } from "@/components/custom/HandleStatusDialog";
import {
	Card,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { getRequest } from "@/lib/apiHandlers";
import { cn, formatPrice } from "@/lib/utils";
import { IOrder } from "@/models/order";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Order: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<IOrder>();

	useEffect(() => {
		const fetchOrder = async () => {
			setLoading(true);
			const res = await getRequest({ url: `/orders/${id}` });

			if (res.status === 200 || res.status === 201) {
				setOrder(res.data.data);
				setLoading(false);
			} else {
				toast({
					title: 'Ошибка',
					description: 'Произошла ошибка при загрузке заказа',
					variant: 'destructive',
				})
			}
		}

		fetchOrder();
	}, [id]);

	return (
		<div>
			{loading ? (
				<>
					<Card className='w-full p-5 flex flex-col gap-20'>
						<div className='space-y-3'>
							<div className='flex justify-between items-center'>
								<Skeleton className='w-96 h-10' />
								<Skeleton className='w-72 h-10' />
							</div>
							<div className='flex justify-between items-center'>
								<Skeleton className='w-60 h-10' />
								<Skeleton className='w-52 h-10' />
							</div>
						</div>
						<div className='space-y-3'>
							<div className='flex justify-between items-center text-[#9c9c9c] text-2xl font-semibold'>
								<Skeleton className='w-60 h-10' />
								<Skeleton className='w-60 h-10' />
							</div>
							<Separator className='bg-[#f8f8f8]' />
							<div className='flex justify-between items-center font-semibold text-3xl'>
								<Skeleton className='w-96 h-10' />
								<Skeleton className='w-80 h-10' />
							</div>
						</div>
					</Card>
					<Card className='w-full my-5 p-5 flex flex-col gap-2'>
						{Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} className="h-16 w-full" />
						))}
					</Card>
				</>
			) : (
				<div className="space-y-5 relative">
					<div className="absolute -top-20 right-5">
						<HandleStatusChangeDialog
							orderId={id as string}
							currentStatus={order?.status as any}
							onChanged={(newStatus) =>
								setOrder((prev) => prev ? { ...prev, status: newStatus } : prev)
							}
						/>
					</div>
					<Card className="flex flex-col items-start gap-5 p-5">
						<CardTitle className="text-xl font-semibold text-black/80">Заказ № {id}</CardTitle>
						<div className="w-full flex justify-between items-center gap-5">
							<div className="w-full space-y-2">
								<div className="flex justify-between items-center text-black/80">
									<p className="text-base font-normal">Взял заказ:</p>
									<span className="text-base font-semibold">{order?.salesperson?.username}</span>
								</div>
								<div className="flex justify-between items-center text-black/80">
									<p className="text-base font-normal">Клиент:</p>
									<span className="text-base font-semibold">{order?.client?.name} {order?.client?.surname}</span>
								</div>
								<div className="flex justify-between items-center text-black/80">
									<p className="text-base font-normal">Догл клиент:</p>
									<span className="text-base font-semibold">{formatPrice(order?.client?.balance as number)}</span>
								</div>
							</div>
							<div className="w-px h-20 bg-black/80"></div>
							<div className="w-full space-y-2">
								<div className="flex justify-between items-center text-black/80">
									<p className="text-base font-normal">Тип оплаты:</p>
									<span className="text-base font-semibold">{order?.paymentMethod === 'cash' ? 'Наличные' : order?.paymentMethod === "transfer" ? "Перевод" : "Догл"}</span>
								</div>
								<div className="flex justify-between items-center text-black/80">
									<p className="text-base font-normal">Статус заказа:</p>
									<span className={cn("text-base font-semibold", order?.status === "delivered" ? "text-green-600" : order?.status === "ready" ? "text-cDarkBlue/80" : order?.status === "in_production" ? "text-cDarkBlue" : order?.status === "pending" ? "text-gray-400" : order?.status === "accepted" ? "text-cLightBlue" : "text-red-600")}>{order?.status === "delivered" ? "Доставлено" : order?.status === "in_production" ? "В производстве" : order?.status === "pending" ? "В ожидании" : order?.status === "ready" ? "Готово" : order?.status === "accepted" ? "Принято" : "Отклонено"}</span>
								</div>
								<div className="flex justify-between items-center text-black/80">
									<p className="text-base font-normal">Сумма заказа:</p>
									<span className="text-base font-semibold">{formatPrice(order?.totalPrice as number)}</span>
								</div>
							</div>
						</div>
					</Card>
					<Card className="w-full overflow-x-auto p-5 my-5">
						<Table className="border-spacing-y-2 border-separate">
							<TableHeader>
								<TableRow className="border-none hover:bg-white">
									<TableHead className="text-left text-base font-semibold">#</TableHead>
									<TableHead className="text-left text-base font-semibold">Наименование</TableHead>
									<TableHead className="text-left text-base font-semibold">Количество</TableHead>
									<TableHead className="text-left text-base font-semibold">Сумма</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{order?.products && order.products.length > 0 ? order.products.map((item, idx) => (
									<TableRow
										key={item?.id}
										className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none cursor-pointer text-left"
										onClick={() => navigate(`/products/${item?.product?.id}`)}
									>
										<TableCell className='text-base rounded-s-xl relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>
											{idx + 1}
										</TableCell>
										<TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">
											<div className='flex justify-start items-center gap-1'>
												<img src={item?.product?.image !== "" ? import.meta.env.VITE_API_URL + "/" + item?.product?.image : "/images/humanPlaceholder.png"} alt="product image" className='w-10 h-10 bg-white rounded-md border object-cover border-cGray' />
												{item?.product?.name}
											</div>
										</TableCell>
										<TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">
											{item?.quantity} шт.
										</TableCell>
										<TableCell className="text-base rounded-e-xl">
											{formatPrice(item?.totalPrice)}
										</TableCell>
									</TableRow>
								)) : (
									<TableRow className="bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none">
										<TableCell className="text-base text-center rounded-xl" colSpan={7}>
											Нет данных по вашему запросу
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Card>
				</div>
			)}
		</div>
	);
};
