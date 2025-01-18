import { Chart } from "@/components/custom/Chart";
import TopRatedList from "@/components/custom/TopRatedList";


export const Dashboard = () => {
    // const [params, setParams] = useState();
    // const [data, setData] = useState<Array<ISpending>>([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const [loading, setLoading] = useState(true);

    // const loadPageData = async (page: number, queryParams?: any) => {
    //     console.log(page, queryParams);

    //     setLoading(true);
    //     const res = await getRequest({ url: `/spending?page=${page}&limit=10`, params: queryParams });
    //     console.log(res);

    //     if (res.status === 200 || res.status === 201) {
    //         setData(res.data.data);
    //         setTotalPages(Math.ceil(res.data.total / 10));
    //         setLoading(false);
    //     } else {
    //         toast({
    //             title: 'Ошибка',
    //             description: 'Произошла ошибка при загрузке расходов',
    //             variant: 'destructive',
    //         });
    //     }
    // };

    // useEffect(() => {
    //     loadPageData(currentPage, params);
    // }, [currentPage, params]);

    return (
        <div className="">
            <Chart />
            <br />
            <TopRatedList />
        </div>
    );
};