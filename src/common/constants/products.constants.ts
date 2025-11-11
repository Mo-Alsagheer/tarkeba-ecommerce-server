export const PRODUCTS_MESSAGES = {
    CREATED_SUCCESSFULLY: 'Product created successfully',
    UPDATED_SUCCESSFULLY: 'Product updated successfully',
    DELETED_SUCCESSFULLY: 'Product deleted successfully',
    STOCK_UPDATED_SUCCESSFULLY: 'Stock updated successfully',
    STOCK_REDUCED_SUCCESSFULLY: 'Stock reduced successfully',
    RESERVED_STOCK_RELEASED_SUCCESSFULLY: 'Reserved stock released successfully',
} as const;

export const PRODUCTS_ERROR_MESSAGES = {
    SLUG_ALREADY_EXISTS: 'Slug already exists',
    INVALID_PRODUCT_ID: 'Invalid product ID',
    PRODUCT_NOT_FOUND: 'Product not found',
    SIZE_REQUIRED: 'Size is required to update variant stock',
    SIZE_REQUIRED_FOR_REDUCTION: 'Size is required to reduce variant stock for product',
    INSUFFICIENT_STOCK: 'Insufficient stock for product',
    FAILED_TO_CREATE: 'Failed to create product',
    FAILED_TO_FETCH: 'Failed to fetch products',
    FAILED_TO_FETCH_BY_ID: 'Failed to fetch product',
    FAILED_TO_FETCH_BY_IDS: 'Failed to fetch products by IDs',
    FAILED_TO_FETCH_BY_SLUG: 'Failed to fetch product by slug',
    FAILED_TO_UPDATE: 'Failed to update product',
    FAILED_TO_DELETE: 'Failed to delete product',
    FAILED_TO_UPDATE_STOCK: 'Failed to update stock for product',
    FAILED_TO_REDUCE_STOCK: 'Failed to reduce stock',
    FAILED_TO_UPDATE_RATING: 'Failed to update rating for product',
    FAILED_TO_FETCH_FEATURED: 'Failed to fetch featured products',
} as const;

export const PRODUCTS_LOG_MESSAGES = {
    PRODUCT_CREATED: (id: string) => `Product created: ${id}`,
    PRODUCT_UPDATED: (id: string) => `Product updated: ${id}`,
    PRODUCT_DELETED: (id: string) => `Product deleted: ${id}`,
    STOCK_UPDATED: (id: string, size: string, quantity: number) =>
        `Product stock updated: ${id}, size: ${size}, quantity: ${quantity}`,
    STOCK_REDUCED: (count: number) => `Stock reduced for ${count} products`,
    RATING_UPDATED: (id: string, rating: number) =>
        `Product rating updated: ${id}, rating: ${rating}`,
    CREATING_PRODUCT: (name: string) => `Creating product: ${name}`,
    FETCHING_PRODUCTS: (query: string) => `Fetching products with query: ${query}`,
    FETCHING_FEATURED: (limit?: number) => `Fetching featured products, limit: ${limit}`,
    FETCHING_BY_SLUG: (slug: string) => `Fetching product by slug: ${slug}`,
    FETCHING_BY_ID: (id: string) => `Fetching product: ${id}`,
    UPDATING_PRODUCT: (id: string) => `Updating product: ${id}`,
    DELETING_PRODUCT: (id: string) => `Deleting product: ${id}`,
    UPDATING_STOCK: (id: string, size: string, quantity: number) =>
        `Updating stock for product: ${id}, size: ${size}, quantity: ${quantity}`,
    GETTING_STOCK_STATUS: (id: string) => `Getting stock status for product: ${id}`,
    VALIDATING_STOCK: (count: number) => `Validating stock for ${count} items`,
    REDUCING_STOCK: (count: number) => `Reducing stock for ${count} items`,
} as const;

export const PRODUCTS_API_RESPONSES = {
    // Success responses
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCTS_RETRIEVED: 'Products retrieved successfully',
    FEATURED_PRODUCTS_RETRIEVED: 'Featured products retrieved successfully',
    PRODUCT_RETRIEVED: 'Product retrieved successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',
    STOCK_UPDATED: 'Stock updated successfully',
    STOCK_STATUS_RETRIEVED: 'Stock status retrieved successfully',
    STOCK_VALIDATION_COMPLETED: 'Stock validation completed',
    STOCK_REDUCED: 'Stock reduced successfully',

    // Error responses
    INVALID_INPUT_DATA: 'Invalid input data',
    PRODUCT_NOT_FOUND: 'Product not found',
    INVALID_PRODUCT_ID: 'Invalid product ID',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    INSUFFICIENT_AVAILABLE_STOCK: 'Insufficient available stock',
    INSUFFICIENT_STOCK_FOR_ITEMS: 'Insufficient stock for one or more items',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN_ADMIN_REQUIRED: 'Forbidden - Admin access required',
} as const;

export const PRODUCTS_OPERATIONS = {
    CREATE_PRODUCT: 'Create a new product',
    GET_ALL_PRODUCTS: 'Get all products with filtering and pagination',
    GET_FEATURED_PRODUCTS: 'Get featured products',
    GET_PRODUCT_BY_SLUG: 'Get product by slug',
    GET_PRODUCT_BY_ID: 'Get product by ID',
    UPDATE_PRODUCT: 'Update product',
    DELETE_PRODUCT: 'Delete product',
    UPDATE_PRODUCT_STOCK: 'Update product stock for a specific variant',
    GET_STOCK_STATUS: 'Get product stock status with warnings',
    VALIDATE_STOCK: 'Validate stock availability for checkout',
    REDUCE_STOCK: 'Atomically reduce stock for completed orders',
} as const;

export const PRODUCTS_SWAGGER_EXAMPLES = {
    PRODUCT_ID: '507f1f77bcf86cd799439011',
    PRODUCT_NAME: 'Premium Cotton T-Shirt',
    PRODUCT_SLUG: 'premium-cotton-t-shirt',
    PRODUCT_DESCRIPTION: 'High-quality cotton t-shirt with modern fit',
    VARIANT_SIZE: 'M',
    VARIANT_PRICE: 29.99,
    VARIANT_STOCK: 100,
    CATEGORY_ID: '507f1f77bcf86cd799439012',
    IMAGE_URL: 'https://example.com/images/product.jpg',
} as const;
