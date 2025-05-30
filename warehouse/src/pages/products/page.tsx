import { LoaderTable } from '@/components/custom/LoaderTable';
import Pagination from '@/components/custom/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { getRequest } from '@/lib/apiHandlers';
import { formatPrice } from '@/lib/utils';
import { ICategory } from '@/models/categories';
import { IProduct } from '@/models/products';
import { RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Products: React.FC = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<Array<IProduct>>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    const loadPageData = async (page: number, searchQuery: string, category?: string) => {
        setLoading(true);
        if (searchQuery === '') {
            const res = await getRequest({ url: `/products?page=${page}&limit=10&category=${category}` });

            if (res.status === 200 || res.status === 201) {
                setData(res.data.data);
                setTotalPages(res.data.pagination.totalPages);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке товаров',
                    variant: 'destructive',
                });
            }
        } else {
            const res = await getRequest({ url: `/products/search?q=${searchQuery}` }); //&category=${category}

            if (res.status === 200 || res.status === 201) {
                setData(res.data.data);
                setTotalPages(1);
                setLoading(false);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке товаров',
                    variant: 'destructive',
                });
            }
        }
    };

    const loadCategories = async () => {
        const res = await getRequest({ url: `/categories`, params: { limit: 10000 } });
        if (res.status === 200 || res.status === 201) {
            setCategories(res.data.data);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при загрузке категорий',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadPageData(currentPage, debouncedSearch, selectedCategory);
    }, [currentPage, debouncedSearch, selectedCategory]);

    return (
        <div className='relative'>
            <Button
                onClick={() => navigate('/products/new')}
                className='absolute -top-20 right-5 px-10'
            >
                Добавить товар
            </Button>
            <Card>
                <CardHeader className='flex justify-between items-center gap-3'>
                    <div className='w-full flex flex-col justify-start items-start gap-1'>
                        <CardTitle>Список товаров</CardTitle>
                        <CardDescription>Список товаров на складе</CardDescription>
                    </div>
                    <Input
                        placeholder='Поиск...'
                        className='w-1/2 p-2 text-sm'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        onValueChange={(value) => setSelectedCategory(value)}
                        defaultValue=""
                    >
                        <SelectTrigger className="w-1/2 p-2">
                            <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <RotateCcw className="cursor-pointer text-cGray w-10 h-10"
                        onClick={() => {
                            setSearch('');
                            setSelectedCategory('');
                            setCurrentPage(1);
                        }}

                    />
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoaderTable />
                    ) : (
                        <>
                            <Table className="border-spacing-y-2 border-separate">
                                <TableHeader>
                                    <TableRow className='hover:bg-white border-none'>
                                        <TableHead>№</TableHead>
                                        <TableHead>Наименование</TableHead>
                                        <TableHead>Цена</TableHead>
                                        <TableHead>Количество на складу</TableHead>
                                        <TableHead>Товара на сумму</TableHead>
                                        <TableHead>Ед. измерения</TableHead>
                                        <TableHead>Катерогия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data && data.length > 0 ? (
                                        data.map((item: IProduct, idx: number) => (
                                            <TableRow className='bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 border-none text-left cursor-pointer' key={idx} onClick={() => navigate(`/products/${item.id}`)}>
                                                <TableCell className='text-base rounded-s-xl relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>{idx + 1}</TableCell>
                                                <TableCell className='flex gap-1 items-center text-base text-left relative after:content-[""] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50'>
                                                    <img src={item.image !== "" ? import.meta.env.VITE_API_URL + "/" + item.image : "/images/humanPlaceholder.png"} alt="product image" loading='lazy' className='w-10 h-10 object-cover rounded-lg border border-gray-200' />
                                                    {item.name}
                                                </TableCell>
                                                <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{formatPrice(item.price)}</TableCell>
                                                <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{item.amount} шт.</TableCell>
                                                <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{formatPrice(item.price * item.amount)}</TableCell>
                                                <TableCell className="text-base text-left relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#CBCBCB]/50">{item.unit === 'piece' ? 'В штуках' : 'В метрах'}</TableCell>
                                                <TableCell className="text-base rounded-e-xl">{item?.category?.name}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
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