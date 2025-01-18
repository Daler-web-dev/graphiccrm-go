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
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    const loadPageData = async (page: number, searchQuery: string, category?: string) => {
        setLoading(true);
        const params = new URLSearchParams({
            page: String(page),
            limit: '10',
            search: searchQuery,
            ...(category ? { category: category } : {}),
        });

        const res = await getRequest({ url: `/products?${params.toString()}` });

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
    };

    const loadCategories = async () => {
        const res = await getRequest({ url: `/categories` });
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
                        className='max-w-[300px] px-10'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        onValueChange={(value) => setSelectedCategory(value)}
                        defaultValue=""
                    >
                        <SelectTrigger className="w-1/3">
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
                            <Table>
                                <TableHeader>
                                    <TableRow className='hover:bg-white border-none'>
                                        <TableHead>№</TableHead>
                                        <TableHead>Наименование</TableHead>
                                        <TableHead>Ед. измерения</TableHead>
                                        <TableHead>Катерогия</TableHead>
                                        <TableHead>Цена</TableHead>
                                        <TableHead>Количество на складу</TableHead>
                                        <TableHead>Товара на сумму</TableHead>
                                        <TableHead>Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length > 0 ? (
                                        data.map((item: IProduct, idx: number) => (
                                            <TableRow className='text-left'>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell className='flex gap-1 items-center'>
                                                    <img src={item.image} alt="product image" loading='lazy' className='w-10 h-10 object-cover rounded-lg border border-gray-200' />
                                                    {item.name}
                                                </TableCell>
                                                <TableCell>{item.unit === 'piece' ? 'В штуках' : 'В сантиметрах'}</TableCell>
                                                <TableCell>{item.category.name}</TableCell>
                                                <TableCell>{formatPrice(item.price)}</TableCell>
                                                <TableCell>{item.amount} шт.</TableCell>
                                                <TableCell>{formatPrice(item.price * item.amount)}</TableCell>
                                                <TableCell className='flex gap-2'>
                                                    <Button onClick={() => navigate(`/products/${item.id}`)}>Просмотр</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">
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
            {/* <Card className='w-full mt-5'>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className='hover:bg-transparent'>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Продано за месяц</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Произведено</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Итого на складе</TableHead>
                                <TableHead className='font-medium text-xl text-cLightBlue'>Итого сумма</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='text-left hover:bg-transparent'>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + order.soldLastMonth, 0)}</TableCell>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + order.producedLastMonth, 0)}</TableCell>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + order.overallLeft, 0)}</TableCell>
                                <TableCell className='font-bold text-2xl'>{products.reduce((acc, order) => acc + (order.price * order.overallLeft), 0)} сум</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card> */}
        </div>
    );
};