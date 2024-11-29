import { Chart } from "@/components/custom/Chart";
import { HistoryList } from "@/components/custom/HistoryList";


export const Dashboard = () => {
    const history = [
        {
            id: 3245,
            orderNumber: 123456,
            date: '2022-10-01',
            total: 3000000,
            paymentType: 'Наличные',
            status: 'Выполнен'
        },
        {
            id: 2345,
            orderNumber: 1324567,
            date: '2022-01-11',
            total: 13220000,
            paymentType: 'Перевод',
            status: 'В процессе'
        },
        {
            id: 3124536,
            orderNumber: 756343,
            date: '2022-07-19',
            total: 6600000,
            paymentType: 'Долг',
            status: 'В ожидании'
        },
    ]

    return (
        <div className="space-y-5">
            <Chart />
            <HistoryList data={history} title="История сегодняшних заказов" />
        </div>
    );
};