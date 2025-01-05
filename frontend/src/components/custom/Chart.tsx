"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
	{ month: "Январь", desktop: 100 },
	{ month: "Февраль", desktop: 125 },
	{ month: "Март", desktop: 140 },
	{ month: "Апрель", desktop: 100 },
	{ month: "Май", desktop: 130 },
	{ month: "Июнь", desktop: 160 },
	{ month: "Июль", desktop: 200 },
	{ month: "Август", desktop: 230 },
	{ month: "Сентябрь", desktop: 210 },
	{ month: "Октябрь", desktop: 180 },
	{ month: "Ноябрь", desktop: 150 },
	{ month: "Декабрь", desktop: 200 },
];

const chartConfig = {
	desktop: {
		label: "Продажи:",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function Chart() {
	return (
		<Card>
			<CardHeader className="w-full flex justify-between items-center px-8">
				<div>
					<CardTitle className="text-cBlack">Дэшборд</CardTitle>
					<CardDescription className="text-cLightBlue">
						Годовой оборот
					</CardDescription>
				</div>
				<div>
					<CardDescription className="text-cLightBlue">
						Общая сумма
					</CardDescription>
					<CardTitle className="flex justify-center items-center gap-5 text-cBlack">
						77,777,777 сум
						<div className="text-white p-2 rounded-3xl bg-cLightBlue flex justify-center items-center gap-2 font-medium text-xs">
							<TrendingUp className="h-4 w-4" />
							23.5%
						</div>
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 10,
							left: -20,
							right: 0,
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
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => `${value}`}
						/>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Area
							dataKey="desktop"
							type="natural"
							fill="url(#desktopGradient)"
							fillOpacity={1}
							stroke="#002395"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}