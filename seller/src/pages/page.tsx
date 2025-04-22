import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/clients');
    }, [navigate])
    return (
        <div className="">
            {/* <Chart />
            <br />
            <TopRatedList /> */}
        </div>
    );
};