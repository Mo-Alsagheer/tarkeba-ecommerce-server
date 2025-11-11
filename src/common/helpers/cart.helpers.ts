import { ProductsService } from '../../modules/commerce/catalog/products/products.service';
import { CartItem } from '../interfaces';
import { BatchProductFetchResult } from '../types/cart.types';

/**
 * Helper function: Batch fetch products and build a map for O(1) lookups
 * Reduces N database queries to 1
 * @param cartItems - Array of cart items containing product IDs
 * @param productsService - Products service instance for fetching
 * @returns Object containing productMap and products array
 */
export async function batchFetchProducts(
    cartItems: CartItem[],
    productsService: ProductsService
): Promise<BatchProductFetchResult> {
    // Extract unique product IDs
    const uniqueProductIds = [...new Set(cartItems.map((item) => item.productId))];

    // Batch fetch all products in one query
    const products = await productsService.findByIDs(uniqueProductIds);

    // Build product map for O(1) lookup
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    return { productMap, products };
}
