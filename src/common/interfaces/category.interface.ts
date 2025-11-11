import { Types } from 'mongoose';

export interface ICategorySeo {
    title?: string;
    description?: string;
    keywords?: string[];
}

export interface ICategoryTree {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    parentID?: Types.ObjectId;
    isActive: boolean;
    sortOrder: number;
    image?: string;
    seo?: ICategorySeo;
    productCount: number;
    tags?: string[];
    children: ICategoryTree[];
}

export interface ICategoriesResponse {
    categories: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ICategoryQuery {
    page?: number;
    limit?: number;
    search?: string;
    parentID?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
