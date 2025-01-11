import { IClient } from "./clients"

export interface IOrder {
    id: string
    salespersonId: string
    salesperson: string
    clientId: string
    client: IClient
    products: IOrderItem[]
    status: string
    paymentMethod: string
    totalPrice: number
    createdAt: string
    updatedAt: string
}

export interface IOrderItem {
    id: string
    orderId: string
    productId: string
    product: string
    quantity: number
    totalPrice: number
}