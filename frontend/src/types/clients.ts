export interface IClient {
    id: string
    name: string
    surname: string
    contactInfo: string
    address: string
    balance: number
    Note: string
    salespersonId: string
    purchangeHistory: IOrder[]
    createdAt: string
    updatedAt: string
}

export interface IOrder {
    id: string
}