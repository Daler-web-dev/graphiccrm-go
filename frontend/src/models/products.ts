import { ProdUnit } from "@/types/prodUnit"
import { ICategory } from "./categories"

export interface IProduct extends IProductCreateUpdate {
    id: string
    category: ICategory
    searchVector: string
    deletedAt: string
    createdAt: string
    updatedAt: string
}

export interface IProductCreateUpdate {
    name: string
    categoryId: string
    width: string
    height: string
    price: number
    unit: ProdUnit
    amount: number
    image: string
}