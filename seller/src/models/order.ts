import { PaymentMethod } from "@/types/paymentMethod"
import { IClient } from "./clients"
import { IEmployee } from "./employees"
import { IProduct } from "./products"

export interface IOrder {
    id: string
    salespersonId: string
    salesperson: IEmployee
    clientId: string
    client: IClient
    products: IOrderItem[]
    status: string
    paymentMethod: PaymentMethod
    totalPrice: number
    attachments: string[]
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