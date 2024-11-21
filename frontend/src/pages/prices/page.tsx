import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
    price: string
}

export const Prices: React.FC = () => {

    const products = [
        {
            id: 1,
            title: "Товар 1",
            description: "Описание",
            price: 0,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 2,
            title: "Товар 2",
            description: "Описание",
            price: 200000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 3,
            title: "Товар 3",
            description: "Описание",
            price: 300000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 4,
            title: "Товар 4",
            description: "Описание",
            price: 400000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 5,
            title: "Товар 5",
            description: "Описание",
            price: 500000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 6,
            title: "Товар 6",
            description: "Описание",
            price: 0,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 7,
            title: "Товар 7",
            description: "Описание",
            price: 0,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 8,
            title: "Товар 8",
            description: "Описание",
            price: 800000,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 9,
            title: "Товар 9",
            description: "Описание",
            price: 0,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        },
        {
            id: 10,
            title: "Товар 10",
            description: "Описание",
            price: 0,
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            overallLeft: 10,
            soldLastMonth: 5,
            producedLastMonth: 3
        }
    ]

    return (
        <Card>
            <CardHeader className='flex flex-col justify-center items-start'>
                <CardTitle>Укажите цену</CardTitle>
                <CardDescription className='text-cLightBlue'>Укажите цену нового товара</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Наименование</TableHead>
                            <TableHead className='text-right'>Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            if (product.price === 0) {
                                return (
                                    <TableRow key={product.id} className='text-left'>
                                        <TableCell>{product.title}</TableCell>
                                        <TableCell className='text-right'><Modal trigger={<Button>Указать цену</Button>} /></TableCell>
                                    </TableRow>)
                            }
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const Modal = ({ trigger }: { trigger: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        setOpen(!open)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Укажите цену товара</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full flex flex-col justify-center items-start gap-1">
                            <label
                                htmlFor="price"
                                className="font-normal text-sm text-[#1C1B1F] cursor-pointer"
                            >
                                Цена
                            </label>
                            <input
                                id="price"
                                {...register("price", { required: true })}
                                className="w-full border border-[#79747E] rounded-xl py-2 px-4 text-base font-normal placeholder:text-sm"
                                placeholder="Введите цену в сумах"
                            />
                            {errors.price && (
                                <span className="font-normal text-sm text-red-500">
                                    Поле обязательно для заполнения
                                </span>
                            )}
                        </div>
                        <div className='flex gap-3'>
                            <input
                                type="submit"
                                className="w-full transition duration-300 bg-[#00BE13] rounded-xl py-3 text-sm font-semibold text-white hover:text-white/80 mt-3 cursor-pointer"
                                value="Указать цену"
                            />
                            <input
                                type="button"
                                className="w-full transition duration-300 bg-[#D71B1B] rounded-xl py-3 text-sm font-semibold text-white hover:text-white/80 mt-3 cursor-pointer"
                                value="Отменить"
                                onClick={() => {
                                    setOpen(!open)
                                    reset()
                                }}
                            />
                        </div>
                    </form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}