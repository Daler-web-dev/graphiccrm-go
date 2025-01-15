import { IOrder } from "./order"

export interface IClient extends IClientCreateUpdate {
    id: string
    balance: number
    salespersonId: string
    purchaseHistory: IOrder[]
    createdAt: string
    updatedAt: string
}

export interface IClientCreateUpdate {
    image: string
    name: string
    surname: string
    contactInfo: string
    address: string
    Note: string
}
