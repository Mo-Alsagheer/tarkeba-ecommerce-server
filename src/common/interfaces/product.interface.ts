import { ProductStatus, StockStatus } from '../enums';
import { ObjectId, PaginatedResponse, SearchQuery } from '../types';

export interface IProduct {
    id: ObjectId;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    sku: string;
    price: number;
    salePrice?: number;
    costPrice?: number;
    compareAtPrice?: number;
    status: ProductStatus;
    isActive: boolean;
    isFeatured: boolean;
    categories: ObjectId[];
    tags: string[];
    images: Array<{
        url: string;
        alt: string;
        isPrimary: boolean;
    }>;
    inventory: {
        quantity: number;
        trackQuantity: boolean;
        allowBackorder: boolean;
        lowStockThreshold: number;
        status: StockStatus;
    };
    seo: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    attributes: Record<string, any>;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    rating: number;
    reviewCount: number;
    salesCount: number;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductService {
    create(productData: Partial<IProduct>): Promise<IProduct>;
    findById(id: string): Promise<IProduct | null>;
    findBySlug(slug: string): Promise<IProduct | null>;
    update(id: string, updateData: Partial<IProduct>): Promise<IProduct>;
    delete(id: string): Promise<void>;
    findAll(query: SearchQuery): Promise<PaginatedResponse<IProduct>>;
    search(searchTerm: string, filters?: any): Promise<PaginatedResponse<IProduct>>;
    updateStock(id: string, quantity: number): Promise<void>;
    bulkUpdateStock(updates: Array<{ id: string; quantity: number }>): Promise<void>;
    getFeatured(limit?: number): Promise<IProduct[]>;
    getByCategory(categoryId: string, query?: SearchQuery): Promise<PaginatedResponse<IProduct>>;
    updateRating(id: string, rating: number): Promise<void>;
    incrementViewCount(id: string): Promise<void>;
    validateStockForCheckout(items: Array<{ productId: string; quantity: number }>): Promise<{
        valid: boolean;
        unavailableItems: Array<{
            productId: string;
            requested: number;
            available: number;
        }>;
    }>;
    reduceStockForOrder(items: Array<{ productId: string; quantity: number }>): Promise<void>;
}

export interface IProductRepository {
    create(productData: Partial<IProduct>): Promise<IProduct>;
    findById(id: string): Promise<IProduct | null>;
    findBySlug(slug: string): Promise<IProduct | null>;
    update(id: string, updateData: Partial<IProduct>): Promise<IProduct>;
    delete(id: string): Promise<boolean>;
    findMany(query: any, options?: any): Promise<IProduct[]>;
    count(query?: any): Promise<number>;
    search(searchTerm: string, filters?: any, options?: any): Promise<IProduct[]>;
    updateStock(id: string, quantity: number): Promise<boolean>;
    bulkUpdateStock(updates: Array<{ id: string; quantity: number }>): Promise<boolean>;
}
