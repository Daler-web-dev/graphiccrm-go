export interface ICategory extends ICategoryCreateUpdate {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface ICategoryCreateUpdate {
    name: string;
}