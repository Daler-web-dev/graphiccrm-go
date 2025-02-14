export interface IStatistics {
    top_clients: IStatsCLients[]
    top_products: IStatsProducts[]
}

export interface IStatsCLients {
    client_id: string
    client_name: string
    order_count: number
    total_spent: number
}

export interface IStatsProducts {
    product_id: string
    product_name: string
    units_sold: number
    total_sold: number
}