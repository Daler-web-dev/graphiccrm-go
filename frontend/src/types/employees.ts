import { IClient } from "./clients"
import { IOrder } from "./order"

export type Roles = "manager" | "seller" | "admin"

export interface IEmployee extends Omit<IEmployeeCreateUpdate, "password"> {
    id: string
    clients: IClient[]
    orders: IOrder[]
    createdAt: string
    updatedAt: string
}


export interface IEmployeeCreateUpdate {
    username: string
    password: string
    role: Roles
}