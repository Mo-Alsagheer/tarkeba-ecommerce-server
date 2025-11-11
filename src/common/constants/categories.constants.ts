export const CATEGORIES_MESSAGES = {
    CREATED_SUCCESSFULLY: 'Category created successfully',
    UPDATED_SUCCESSFULLY: 'Category updated successfully',
    DELETED_SUCCESSFULLY: 'Category deleted successfully',
    PRODUCT_COUNT_UPDATED: 'Product count updated successfully',
} as const;

export const CATEGORIES_ERROR_MESSAGES = {
    SLUG_ALREADY_EXISTS: 'Slug already exists',
    PARENT_CATEGORY_NOT_FOUND: 'Parent category not found',
    CATEGORY_NOT_FOUND: 'Category not found',
    INVALID_CATEGORY_ID: 'Invalid category ID',
    INVALID_PARENT_CATEGORY_ID: 'Invalid parent category ID',
    CANNOT_DELETE_WITH_PRODUCTS: 'Cannot delete category with products',
    CANNOT_DELETE_WITH_SUBCATEGORIES: 'Cannot delete category with subcategories',
    CANNOT_SET_SELF_AS_PARENT: 'Cannot set category as its own parent',
    CIRCULAR_REFERENCE_DETECTED: 'Circular reference detected in category hierarchy',
    UNKNOWN_ERROR: 'Unknown error',
} as const;

export const CATEGORIES_LOG_MESSAGES = {
    CATEGORY_CREATED: 'Category created',
    CATEGORY_UPDATED: 'Category updated',
    CATEGORY_DELETED: 'Category deleted',
    PRODUCT_COUNT_UPDATED: 'Product count updated for category',
    FAILED_TO_CREATE: 'Failed to create category',
    FAILED_TO_FETCH: 'Failed to fetch category',
    FAILED_TO_FETCH_CATEGORIES: 'Failed to fetch categories',
    FAILED_TO_FETCH_BY_SLUG: 'Failed to fetch category by slug',
    FAILED_TO_UPDATE: 'Failed to update category',
    FAILED_TO_DELETE: 'Failed to delete category',
    FAILED_TO_FETCH_TREE: 'Failed to fetch category tree',
    FAILED_TO_FETCH_SUBCATEGORIES: 'Failed to fetch subcategories for',
    FAILED_TO_UPDATE_PRODUCT_COUNT: 'Failed to update product count for category',
} as const;

export const CATEGORIES_API_RESPONSES = {
    // Success responses
    CATEGORY_CREATED: 'Category created successfully',
    CATEGORIES_RETRIEVED: 'Categories retrieved successfully',
    CATEGORY_RETRIEVED: 'Category retrieved successfully',
    CATEGORY_UPDATED: 'Category updated successfully',
    CATEGORY_DELETED: 'Category deleted successfully',
    CATEGORY_TREE_RETRIEVED: 'Category tree retrieved successfully',
    SUBCATEGORIES_RETRIEVED: 'Subcategories retrieved successfully',

    // Error responses
    INVALID_INPUT_DATA: 'Invalid input data',
    CATEGORY_NOT_FOUND: 'Category not found',
    INVALID_CATEGORY_ID: 'Invalid category ID',
    SLUG_ALREADY_EXISTS: 'Slug already exists',
    PARENT_CATEGORY_NOT_FOUND: 'Parent category not found',
    CANNOT_DELETE_WITH_PRODUCTS: 'Cannot delete category with products',
    CANNOT_SET_SELF_AS_PARENT: 'Cannot set category as its own parent',
    CIRCULAR_REFERENCE_DETECTED: 'Circular reference detected in category hierarchy',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN_ADMIN_REQUIRED: 'Forbidden - Admin access required',
} as const;

export const CATEGORIES_OPERATIONS = {
    CREATE_CATEGORY: 'Create a new category',
    GET_ALL_CATEGORIES: 'Get all categories with filtering and pagination',
    GET_CATEGORY_TREE: 'Get hierarchical category tree',
    GET_CATEGORY_BY_ID: 'Get category by ID',
    GET_CATEGORY_BY_SLUG: 'Get category by slug',
    GET_SUBCATEGORIES: 'Get subcategories of a parent category',
    UPDATE_CATEGORY: 'Update category',
    DELETE_CATEGORY: 'Delete category',
    UPDATE_PRODUCT_COUNT: 'Update product count for category',
} as const;

export const CATEGORIES_CONTROLLER_LOG_MESSAGES = {
    CREATING_CATEGORY: 'Creating category',
    FETCHING_CATEGORIES: 'Fetching categories with query',
    FETCHING_CATEGORY_TREE: 'Fetching category tree',
    FETCHING_CATEGORY_BY_SLUG: 'Fetching category by slug',
    FETCHING_CATEGORY: 'Fetching category',
    FETCHING_SUBCATEGORIES: 'Fetching subcategories for',
    UPDATING_CATEGORY: 'Updating category',
    DELETING_CATEGORY: 'Deleting category',
    UPDATING_PRODUCT_COUNT: 'Updating product count for category',
} as const;

export const CATEGORIES_SWAGGER_PARAMS = {
    CATEGORY_ID: {
        name: 'id',
        description: 'Category ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    },
    CATEGORY_SLUG: {
        name: 'slug',
        description: 'Category slug',
        example: 'electronics',
    },
} as const;

export const CATEGORIES_SWAGGER_EXAMPLES = {
    CATEGORY_NAME: 'Electronics',
    CATEGORY_SLUG: 'electronics',
    CATEGORY_DESCRIPTION:
        'All electronic devices including smartphones, laptops, tablets, and accessories',
    CATEGORY_IMAGE_URL: 'https://example.com/images/electronics.jpg',
    SEO_TITLE: 'Best Electronics - Shop Online',
    SEO_DESCRIPTION:
        'Browse our wide selection of electronics including phones, laptops, and accessories',
    SEO_KEYWORDS: ['electronics', 'gadgets', 'technology'],
    TAGS: ['featured', 'trending', 'new'],
    MONGODB_OBJECT_ID: '507f1f77bcf86cd799439011',
} as const;
