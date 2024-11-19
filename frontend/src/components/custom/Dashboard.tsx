import { Chart } from "./Chart";
import TopRatedList from "./TopRatedList";


export const Dashboard = () => {
    return (
        <div className="pt-5 pb-5">
            <Chart />
            <br />
            <TopRatedList />
        </div>
    );
};