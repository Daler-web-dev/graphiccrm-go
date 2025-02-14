import { useState } from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"



export function OrdersQuery({
    className,
    setParams
}: {
    className?: string,
    setParams: (data: any) => void
}) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: addDays(new Date(), +1),
    })

    const handleSubmit = async () => {
        if (!date?.from || !date.to) {
            toast({
                title: "Ошибка",
                description: "Пожалуйста, выберите дату",
                variant: "destructive",
            });
            return;
        }

        const result = {
            dateGte: new Date(date.from).toISOString().split("T")[0],
            dateLte: new Date(date.to).toISOString().split("T")[0],
        };
        setParams(result);
    };

    return (
        <div className={cn("flex justify-end gap-3 items-center", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 opacity-80 text-cOrange" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Выберите дату</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            <Button onClick={handleSubmit} className="px-7" variant={"custom"}>
                Показать
            </Button>
            <RotateCcw className="cursor-pointer text-gray-400" onClick={() => {
                setDate({
                    from: addDays(new Date(), -7),
                    to: new Date(),
                });
                setParams(null);
            }} />
        </div>
    )
}
