import { TopRated } from "./TopRated";
import { User, Box } from "lucide-react"; // Importing Lucide icons

const clients = [
    {
        id: "1",
        name: "Shirt Creme",
        username: "shirtcreme",
        buySum: "500.000K",
        contact: "+998778789789",
    },
    {
        id: "2",
        name: "Shirt X",
        username: "shirtx",
        buySum: "350.000K",
        contact: "+998778789789",
    },
    {
        id: "3",
        name: "Shirt Y",
        username: "shirty",
        buySum: "185.000K",
        contact: "+998778789789",
    },
];

const products = [
    {
        id: "1",
        name: "Shirt Creme",
        category: "Top Seller",
        countSold: "500.000K",
        priceSum: "130,000,000 Sum",
    },
    {
        id: "2",
        name: "Shirt X",
        category: "Popular",
        countSold: "350.000K",
        priceSum: "100,000,000 Sum",
    },
    {
        id: "3",
        name: "Shirt Y",
        category: "New Arrival",
        countSold: "185.000K",
        priceSum: "75,000,000 Sum",
    },
];

export default function TopRatedList() {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Top Clients Section */}
            <div className="rounded-md border p-4 bg-white shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Top Clients</h2>
                    <button className="text-sm font-medium text-blue-500 hover:underline">
                        See more
                    </button>
                </div>
                <TopRated
                    className="w-full"
                    columns={[
                        { key: "id", label: "No" },
                        {
                            key: "name",
                            label: "User Name",
                            render: (value, row) => (
                                <div className="flex items-center">
                                    <User className="text-gray-400 mr-2" />
                                    <div>
                                        <span className="truncate font-medium">{value}</span>
                                        <div className="truncate text-xs text-gray-500">{row.username}</div>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "buySum", label: "Buy sum" },
                        {
                            key: "contact",
                            label: "Contacts",
                            render: (value) => (
                                <div className="flex items-center">
                                    <span>{value}</span>
                                </div>
                            ),
                        },
                    ]}
                    data={clients}
                />
            </div>

            {/* Top Products Section */}
            <div className="rounded-md border p-4 bg-white shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Top Products</h2>
                    <button className="text-sm font-medium text-blue-500 hover:underline">
                        See more
                    </button>
                </div>
                <TopRated
                    className="w-full"
                    columns={[
                        { key: "id", label: "No" },
                        {
                            key: "name",
                            label: "Product Name",
                            render: (value, row) => (
                                <div className="flex items-center">
                                    <Box className="text-gray-400 mr-2" />
                                    <div>
                                        <span className="truncate font-medium">{value}</span>
                                        <div className="truncate text-xs text-gray-500">{row.category}</div>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "countSold", label: "Count of Sold" },
                        { key: "priceSum", label: "Price Sum" },
                    ]}
                    data={products}
                />
            </div>
        </div>
    );
}
