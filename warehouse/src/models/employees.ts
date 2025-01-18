import { Roles } from "@/types/role"
import { IClient } from "./clients"
import { IOrder } from "./order"

export interface IEmployee extends Omit<IEmployeeCreateUpdate, "password"> {
    id: string
    clients: IClient[]
    orders: IOrder[]
    createdAt: string
    updatedAt: string
}


export interface IEmployeeCreateUpdate {
    image: string
    username: string
    password: string
    role: Roles
}