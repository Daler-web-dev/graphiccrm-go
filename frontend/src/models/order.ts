import { PaymentMethod } from "@/types/paymentMethod"
import { IClient } from "./clients"
import { IEmployee } from "./employees"
import { IProduct } from "./products"
import { OrderStatus } from "@/types/orderStatus"

export interface IOrder {
    id: string
    salespersonId: string
    salesperson: IEmployee
    clientId: string
    client: IClient
    products: IOrderItem[]
    status: OrderStatus
    paymentMethod: PaymentMethod
    totalPrice: number
    createdAt: string
    updatedAt: string
}

export interface IOrderItem {
    id: string
    orderId: string
    productId: string
    product: IProduct
    quantity: number
    totalPrice: number
}