import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getRequest } from '@/lib/apiHandlers';
import { toast } from '@/hooks/use-toast';

interface IChart {
    month: string;
    value: number;
}

const formatData = (data: { total_amount: number, date: string }[], interval: string) => {
    const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

    return data.map(item => {
        const date = new Date(item.date);

        let label = "";
        if (interval === "year") {
            label = monthNames[date.getUTCMonth()];
        } else if (interval === "month") {
            const day = date.getUTCDate();
            label = `${day.toString().padStart(2, '0')}.${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;  // dd.mm
        }

        return {
            month: label,
            value: item.total_amount,
        };
    });
};

interface Props {
    className?: string;
}

export const Chart: React.FC<Props> = ({ className }) => {
    const [revenuePeriod, setRevenuePeriod] = useState("year");
    const [revenueData, setRevenueData] = useState<IChart[]>();

    useEffect(() => {
        const fetchData = async () => {
            const revenueRes = await getRequest({ url: '/statistics/chart', params: { period: 'year' } });

            if (revenueRes.status === 200 || revenueRes.status === 201) {
                const formattedRevenueData = formatData(revenueRes.data, 'year');
                setRevenueData(formattedRevenueData);
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Произошла ошибка при загрузке выручки',
                    variant: 'destructive',
                })
            }
        }

        fetchData();
    }, []);

    const handleRevenueChange = async (value: string) => {
        if (revenuePeriod === value) return;
        setRevenuePeriod(value);
        const res = await getRequest({ url: '/statistics/chart', params: { period: value } });
        if (res.status === 200 || res.status === 201) {
            const formattedRevenueData = formatData(res.data, value);
            setRevenueData(formattedRevenueData);
        } else {
            toast({
                title: 'Ошибка',
                description: 'Произошла ошибка при загрузке выручки',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-xl font-normal">Выручка</CardTitle>
                <Select value={revenuePeriod} onValueChange={handleRevenueChange}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Месяц" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">Месяц</SelectItem>
                        <SelectItem value="year">Год</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        value: {
                            label: "Выручка",
                            color: "hsl(24.6 95% 53.1%)",
                        },
                    }}
                    className="w-full h-[200px]"
                >
                    <AreaChart
                        data={revenueData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 20,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="desktopGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="10%"
                                    stopColor="#4991EF"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#4991EF"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="month"
                            stroke="hsl(var(--muted-foreground))"
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000}к`}
                            dx={-10}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            fill="url(#desktopGradient)"
                            fillOpacity={1}
                            stroke="#002395"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};