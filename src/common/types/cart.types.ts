import { ProductDocument } from '../../modules/commerce/catalog/products/entities/product.entity';

/**
 * Product map type for O(1) lookups
 * Maps product ID string to ProductDocument
 */
export type ProductMap = Map<string, ProductDocument>;

/**
 * Result of batch fetching products
 */
export interface BatchProductFetchResult {
    productMap: ProductMap;
    products: ProductDocument[];
}
