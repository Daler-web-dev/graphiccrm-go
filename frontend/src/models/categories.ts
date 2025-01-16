export interface ICategory extends ICategoryCreateUpdate {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface ICategoryCreateUpdate {
    name: string;
}