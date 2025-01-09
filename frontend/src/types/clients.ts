export interface IClient extends IClientCreate {
    id: string
    balance: number
    salespersonId: string
    purchaseHistory: IOrder[]
    createdAt: string
    updatedAt: string
}

export interface IClientCreate {
    name: string
    surname: string
    contactInfo: string
    address: string
    Note: string
}

export interface IOrder {
    id: string
}