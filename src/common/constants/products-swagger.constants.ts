/**
 * Swagger documentation for CreateProductDto fields
 */
export const CREATE_PRODUCT_SWAGGER = {
    name: {
        description: 'Product name',
        example: 'Premium Cotton T-Shirt',
    },

    description: {
        description: 'Detailed product description',
        example: 'High-quality cotton t-shirt with modern fit and comfortable fabric',
    },

    slug: {
        description: 'URL-friendly slug (must be unique)',
        example: 'premium-cotton-t-shirt',
    },

    variants: {
        description: 'Product variants (different sizes with individual pricing and stock)',
        example: [
            { size: 'S', price: 29.99, comparePrice: 39.99, stock: 50 },
            { size: 'M', price: 29.99, comparePrice: 39.99, stock: 100 },
            { size: 'L', price: 29.99, comparePrice: 39.99, stock: 75 },
        ],
    },

    categories: {
        description: 'Array of category IDs this product belongs to',
        example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    },

    images: {
        description: 'Array of product image URLs',
        example: [
            'https://example.com/images/product-1.jpg',
            'https://example.com/images/product-2.jpg',
        ],
    },

    isActive: {
        description: 'Whether the product is active and visible to customers',
        example: true,
        default: true,
    },

    isFeatured: {
        description: 'Whether the product is featured on the homepage',
        example: false,
        default: false,
    },

    weight: {
        description: 'Product weight in grams',
        example: 200,
        minimum: 0,
    },

    dimensions: {
        description: 'Product dimensions',
    },

    attributes: {
        description: 'Custom attributes for the product',
        example: { material: 'cotton', care: 'machine washable' },
    },

    seo: {
        description: 'SEO metadata for the product',
    },

    tags: {
        description: 'Product tags for categorization and search',
        example: ['summer', 'casual', 'bestseller'],
    },
} as const;

/**
 * Swagger documentation for VariantDto fields
 */
export const VARIANT_SWAGGER = {
    size: {
        description: 'Size variant (e.g., S, M, L, XL)',
        example: 'M',
    },

    price: {
        description: 'Price for this variant',
        example: 29.99,
        minimum: 0,
    },

    comparePrice: {
        description: 'Compare at price (original price before discount)',
        example: 39.99,
        minimum: 0,
    },

    stock: {
        description: 'Stock quantity for this variant',
        example: 100,
        minimum: 0,
    },
} as const;

/**
 * Swagger documentation for DimensionsDto fields
 */
export const DIMENSIONS_SWAGGER = {
    length: {
        description: 'Length in centimeters',
        example: 30,
        minimum: 0,
    },

    width: {
        description: 'Width in centimeters',
        example: 20,
        minimum: 0,
    },

    height: {
        description: 'Height in centimeters',
        example: 5,
        minimum: 0,
    },
} as const;

/**
 * Swagger documentation for SeoDto fields
 */
export const SEO_SWAGGER = {
    title: {
        description: 'SEO title for the product',
        example: 'Premium Cotton T-Shirt - Comfortable & Stylish',
    },

    description: {
        description: 'SEO description for the product',
        example: 'High-quality cotton t-shirt perfect for everyday wear',
    },

    keywords: {
        description: 'SEO keywords for the product',
        example: ['t-shirt', 'cotton', 'casual', 'comfortable'],
    },
} as const;

/**
 * Swagger documentation for QueryProductDto fields
 */
export const QUERY_PRODUCT_SWAGGER = {
    page: {
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        minimum: 1,
    },

    limit: {
        description: 'Number of items per page',
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
    },

    search: {
        description: 'Search term to filter products by name, description, or tags',
        example: 't-shirt',
    },

    category: {
        description: 'Category ID to filter products',
        example: '507f1f77bcf86cd799439011',
    },

    minPrice: {
        description: 'Minimum price filter (filters by variant prices)',
        example: 10,
        minimum: 0,
    },

    maxPrice: {
        description: 'Maximum price filter (filters by variant prices)',
        example: 100,
        minimum: 0,
    },

    isActive: {
        description: 'Filter by active status',
        example: true,
    },

    isFeatured: {
        description: 'Filter by featured status',
        example: false,
    },

    sortBy: {
        description: 'Field to sort by',
        enum: ['name', 'price', 'createdAt', 'averageRating', 'stock'],
        default: 'createdAt',
        example: 'createdAt',
    },

    sortOrder: {
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'desc',
        example: 'desc',
    },
} as const;

/**
 * Swagger documentation for UpdateStockDto fields
 */
export const UPDATE_STOCK_SWAGGER = {
    quantity: {
        description: 'Quantity to add or subtract from stock (use negative for reduction)',
        example: 10,
        minimum: -1000,
    },

    size: {
        description: 'Size variant to update stock for',
        example: 'M',
    },
} as const;

/**
 * Swagger documentation for StockValidationItemDto fields
 */
export const STOCK_VALIDATION_ITEM_SWAGGER = {
    productID: {
        description: 'Product ID to validate stock for',
        example: '507f1f77bcf86cd799439011',
    },

    quantity: {
        description: 'Quantity requested',
        example: 2,
        minimum: 1,
    },

    size: {
        description: 'Size variant (optional, if not provided validates total stock)',
        example: 'M',
    },
} as const;

/**
 * Swagger documentation for ValidateStockDto fields
 */
export const VALIDATE_STOCK_SWAGGER = {
    items: {
        description: 'Array of items to validate stock for',
    },
} as const;

/**
 * Swagger documentation for StockReductionItemDto fields
 */
export const STOCK_REDUCTION_ITEM_SWAGGER = {
    productID: {
        description: 'Product ID to reduce stock for',
        example: '507f1f77bcf86cd799439011',
    },

    quantity: {
        description: 'Quantity to reduce',
        example: 2,
        minimum: 1,
    },

    size: {
        description: 'Size variant to reduce stock from',
        example: 'M',
    },
} as const;

/**
 * Swagger documentation for ReduceStockDto fields
 */
export const REDUCE_STOCK_SWAGGER = {
    items: {
        description: 'Array of items to reduce stock for',
    },
} as const;
