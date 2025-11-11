import { ProductDocument } from '../../modules/commerce/catalog/products/entities/product.entity';

/**
 * Paginated products response
 */
export interface PaginatedProductsResponse {
    products: ProductDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Stock validation response
 */
export interface StockValidationResponse {
    valid: boolean;
    unavailableItems: UnavailableStockItem[];
}

/**
 * Unavailable stock item details
 */
export interface UnavailableStockItem {
    productID: string;
    requested: number;
    available: number;
}

/**
 * Stock status response
 */
export interface StockStatusResponse {
    stock: number;
    isAvailable: boolean;
    warning?: string;
}

/**
 * Stock update request item
 */
export interface StockUpdateItem {
    productID: string;
    quantity: number;
    size: string;
}

/**
 * Stock validation request item
 */
export interface StockValidationItem {
    productID: string;
    quantity: number;
    size?: string;
}

/**
 * Product creation response
 */
export interface ProductCreationResponse {
    product: ProductDocument;
    message: string;
}

/**
 * Product update response
 */
export interface ProductUpdateResponse {
    product: ProductDocument;
    message: string;
}

/**
 * Product deletion response
 */
export interface ProductDeletionResponse {
    message: string;
}

/**
 * Stock update response
 */
export interface StockUpdateResponse {
    product: ProductDocument;
    message: string;
}
