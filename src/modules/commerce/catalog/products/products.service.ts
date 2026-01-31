import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { FilterQuery } from 'mongoose';
import {
    PaginatedProductsResponse,
    StockStatusResponse,
    StockValidationResponse,
} from '../../../../common/types';
import { PRODUCTS_ERROR_MESSAGES, PRODUCTS_LOG_MESSAGES } from '../../../../common/constants';
import { FileUploadService } from '../../../common/file-upload/file-upload.service';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        private fileUploadService: FileUploadService
    ) {}

    async create(
        createProductDto: CreateProductDto,
        images?: Express.Multer.File[]
    ): Promise<ProductDocument> {
        try {
            const existingSlug = await this.productModel.findOne({
                slug: createProductDto.slug,
            });

            // Check if slug already exists
            if (existingSlug) {
                throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.SLUG_ALREADY_EXISTS);
            }

            // Upload images if provided
            let imageUrls: string[] = [];
            if (images && images.length > 0) {
                try {
                    const uploadResults = await this.fileUploadService.uploadMultiple(images, {
                        folder: 'products',
                        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                        maxFileSize: 10 * 1024 * 1024, // 10MB
                    });
                    imageUrls = uploadResults.map((result) => result.url);
                    this.logger.log(
                        `${imageUrls.length} images uploaded for product: ${createProductDto.name}`
                    );
                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                    this.logger.error(`Image upload failed: ${errorMsg}`);
                    throw new BadRequestException(`Image upload failed: ${errorMsg}`);
                }
            }

            // Create product with image URLs
            const productData = {
                ...createProductDto,
                images: imageUrls,
            };

            // Create new product
            const product: ProductDocument = new this.productModel(productData);
            await product.save();

            this.logger.log(PRODUCTS_LOG_MESSAGES.PRODUCT_CREATED(String(product._id)));
            return product;
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_CREATE}: ${msg}`);
            throw error;
        }
    }

    async findAll(queryDto: QueryProductDto): Promise<PaginatedProductsResponse> {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            minPrice,
            maxPrice,
            isActive,
            isFeatured,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = queryDto;

        const skip = (page - 1) * limit;

        // Build match filters compatible with variants-based pricing
        const match: FilterQuery<ProductDocument> = {};
        if (search) {
            match.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tag: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) {
            if (!Types.ObjectId.isValid(category)) {
                throw new BadRequestException('Invalid category ID format');
            }
            match.categories = { $in: [new Types.ObjectId(category), category] };
        }
        if (isActive !== undefined) {
            match.isActive = isActive;
        }
        if (isFeatured !== undefined) {
            match.isFeatured = isFeatured;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceCond: { $gte?: number; $lte?: number } = {};
            if (minPrice !== undefined) priceCond.$gte = minPrice;
            if (maxPrice !== undefined) priceCond.$lte = maxPrice;
            // Ensure at least one variant falls in range
            match.variants = { $elemMatch: { price: priceCond } };
        }

        // Map sort fields
        let sortField = sortBy;
        if (sortBy === 'price') sortField = 'minPrice';
        if (sortBy === 'stock') sortField = 'totalStock';
        const sortDir: SortOrder = sortOrder === 'asc' ? 1 : -1;

        try {
            const result: Array<{
                data: ProductDocument[];
                totalCount: Array<{ count: number }>;
            }> = await this.productModel.aggregate([
                { $match: match },
                {
                    $addFields: {
                        price: { $min: '$variants.price' },
                        comparePrice: { $min: '$variants.comparePrice' },
                        totalStock: { $sum: '$variants.stock' },
                    },
                },
                {
                    $facet: {
                        data: [
                            {
                                $lookup: {
                                    from: 'categories',
                                    localField: 'categories',
                                    foreignField: '_id',
                                    as: 'categories',
                                },
                            },
                            {
                                $addFields: {
                                    categories: {
                                        $map: {
                                            input: '$categories',
                                            as: 'c',
                                            in: {
                                                _id: '$$c._id',
                                                name: '$$c.name',
                                                slug: '$$c.slug',
                                            },
                                        },
                                    },
                                },
                            },
                            { $sort: { [sortField]: sortDir, _id: 1 } },
                            { $skip: skip },
                            { $limit: limit },
                        ],
                        totalCount: [{ $count: 'count' }],
                    },
                },
            ]);

            this.logger.debug(result);
            const data = result?.[0]?.data || [];
            const total = result?.[0]?.totalCount?.[0]?.count || 0;
            const totalPages = Math.ceil(total / limit);
            this.logger.debug(data);
            return {
                products: data,
                total,
                page,
                limit,
                totalPages,
            };
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_FETCH}: ${msg}`);
            throw error;
        }
    }

    async findOne(id: string): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.INVALID_PRODUCT_ID);
        }

        try {
            const product = await this.productModel
                .findById(id)
                .populate('categories', 'name slug')
                .exec();

            if (!product) {
                throw new NotFoundException(PRODUCTS_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            return product;
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_FETCH_BY_ID} ${id}: ${msg}`);
            throw error;
        }
    }

    async findByIDs(ids: string[]): Promise<ProductDocument[]> {
        try {
            const objectIds = ids
                .filter((id) => Types.ObjectId.isValid(id))
                .map((id) => new Types.ObjectId(id));

            const products = await this.productModel
                .find({ _id: { $in: objectIds } })
                .populate('categories', 'name slug')
                .exec();

            return products;
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_FETCH_BY_IDS}: ${msg}`);
            throw error;
        }
    }

    async findBySlug(slug: string): Promise<ProductDocument> {
        try {
            const product = await this.productModel
                .findOne({ slug })
                .populate('categories', 'name slug')
                .exec();

            if (!product) {
                throw new NotFoundException(PRODUCTS_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            return product;
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_FETCH_BY_SLUG} ${slug}: ${msg}`);
            throw error;
        }
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto,
        images?: Express.Multer.File[]
    ): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.INVALID_PRODUCT_ID);
        }

        try {
            // Check if slug already exists (if updating slug)
            if (updateProductDto.slug) {
                const existingSlug = await this.productModel.findOne({
                    slug: updateProductDto.slug,
                    _id: { $ne: id },
                });
                if (existingSlug) {
                    throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.SLUG_ALREADY_EXISTS);
                }
            }

            // Upload new images if provided
            let imageUrls: string[] | undefined;
            if (images && images.length > 0) {
                try {
                    const uploadResults = await this.fileUploadService.uploadMultiple(images, {
                        folder: 'products',
                        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                        maxFileSize: 10 * 1024 * 1024, // 10MB
                    });
                    imageUrls = uploadResults.map((result) => result.url);
                    this.logger.log(`${imageUrls.length} images uploaded for product: ${id}`);

                    // Delete old images if they exist
                    const existingProduct = await this.productModel.findById(id);
                    if (existingProduct?.images && existingProduct.images.length > 0) {
                        for (const imageUrl of existingProduct.images) {
                            try {
                                const urlParts = imageUrl.split('/');
                                const publicIdWithExt = urlParts[urlParts.length - 1];
                                const publicId = `products/${publicIdWithExt.split('.')[0]}`;
                                await this.fileUploadService.deleteFile(publicId);
                            } catch (deleteError) {
                                const deleteErrorMsg =
                                    deleteError instanceof Error
                                        ? deleteError.message
                                        : 'Unknown error';
                                this.logger.warn(`Failed to delete old image: ${deleteErrorMsg}`);
                            }
                        }
                    }
                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                    this.logger.error(`Image upload failed: ${errorMsg}`);
                    throw new BadRequestException(`Image upload failed: ${errorMsg}`);
                }
            }

            // Update product with new image URLs if provided
            const updateData = {
                ...updateProductDto,
                ...(imageUrls && { images: imageUrls }),
            };

            const product = await this.productModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .populate('categories', 'name slug')
                .exec();

            if (!product) {
                throw new NotFoundException(PRODUCTS_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            this.logger.log(PRODUCTS_LOG_MESSAGES.PRODUCT_UPDATED(String(product._id)));
            return product;
        } catch (error: unknown) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_UPDATE} ${id}: ${msg}`);
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.INVALID_PRODUCT_ID);
        }

        try {
            const result = await this.productModel.findByIdAndDelete(id).exec();

            if (!result) {
                throw new NotFoundException(PRODUCTS_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            this.logger.log(PRODUCTS_LOG_MESSAGES.PRODUCT_DELETED(id));
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_DELETE} ${id}: ${msg}`);
            throw error;
        }
    }

    async updateStock(id: string, quantity: number, size?: string): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.INVALID_PRODUCT_ID);
        }

        try {
            if (!size) {
                throw new BadRequestException(PRODUCTS_ERROR_MESSAGES.SIZE_REQUIRED);
            }

            const product = await this.productModel
                .findOneAndUpdate(
                    { _id: id, 'variants.size': size },
                    { $inc: { 'variants.$.stock': quantity } },
                    { new: true }
                )
                .exec();

            if (!product) {
                throw new NotFoundException(PRODUCTS_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            // ✅ Optimistic: Allow negative stock (will be handled at checkout)
            this.logger.log(PRODUCTS_LOG_MESSAGES.STOCK_UPDATED(id, size, quantity));
            return product;
        } catch (error: unknown) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_UPDATE_STOCK} ${id}: ${msg}`);
            throw error;
        }
    }

    /**
     * Check if products are available for checkout (optimistic validation)
     */
    async validateStockForCheckout(
        items: {
            productID: string;
            quantity: number;
            size?: string;
        }[]
    ): Promise<StockValidationResponse> {
        const unavailableItems: {
            productID: string;
            requested: number;
            available: number;
        }[] = [];

        for (const item of items) {
            const product = await this.productModel.findById(item.productID).lean();

            if (!product || !product.isActive) {
                unavailableItems.push({
                    productID: item.productID,
                    requested: item.quantity,
                    available: 0,
                });
                continue;
            }

            if (item.size) {
                const variant = product.variants?.find((v) => v.size === item.size);
                const available = variant?.stock ?? 0;
                if (!variant || available < item.quantity) {
                    unavailableItems.push({
                        productID: item.productID,
                        requested: item.quantity,
                        available,
                    });
                }
            } else {
                // Fallback: validate against total stock across variants
                const totalStock = (product.variants || []).reduce(
                    (sum, v) => sum + (v.stock || 0),
                    0
                );
                if (totalStock < item.quantity) {
                    unavailableItems.push({
                        productID: item.productID,
                        requested: item.quantity,
                        available: totalStock,
                    });
                }
            }
        }

        return {
            valid: unavailableItems.length === 0,
            unavailableItems,
        };
    }

    /**
     * Atomically reduce stock for completed orders
     */
    async reduceStockForOrder(
        items: {
            productID: string;
            quantity: number;
            size?: string;
        }[]
    ): Promise<void> {
        try {
            for (const item of items) {
                if (!item.size) {
                    throw new BadRequestException(
                        `${PRODUCTS_ERROR_MESSAGES.SIZE_REQUIRED_FOR_REDUCTION} ${item.productID}`
                    );
                }

                const result = await this.productModel.updateOne(
                    {
                        _id: item.productID,
                        isActive: true,
                        'variants.size': item.size,
                        'variants.stock': { $gte: item.quantity }, // Final stock check on variant
                    },
                    { 
                        $inc: { 
                            'variants.$.stock': -item.quantity,
                            soldCount: item.quantity 
                        } 
                    }
                );

                if (result.matchedCount === 0) {
                    throw new BadRequestException(
                        `${PRODUCTS_ERROR_MESSAGES.INSUFFICIENT_STOCK} ${item.productID}`
                    );
                }
            }

            this.logger.log(PRODUCTS_LOG_MESSAGES.STOCK_REDUCED(items.length));
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_REDUCE_STOCK}: ${msg}`);
            throw error;
        }
    }

    /**
     * Get stock status with warnings for low stock
     */
    async getStockStatus(id: string): Promise<StockStatusResponse> {
        const product = await this.findOne(id);

        const totalStock = (product.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);

        const status: {
            stock: number;
            isAvailable: boolean;
            warning?: string;
        } = {
            stock: totalStock,
            isAvailable: totalStock > 0 && product.isActive,
        };

        // Add warnings for low stock
        if (totalStock <= 0) {
            status.warning = 'Out of stock';
        } else if (totalStock < 5) {
            status.warning = `Only ${totalStock} left in stock`;
        } else if (totalStock < 10) {
            status.warning = 'Low stock';
        }

        return status;
    }

    async updateRating(
        id: string,
        averageRating: number,
        reviewCount: number
    ): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        try {
            const product = await this.productModel
                .findByIdAndUpdate(id, { averageRating, reviewCount }, { new: true })
                .exec();

            if (!product) {
                throw new NotFoundException(PRODUCTS_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            }

            this.logger.log(PRODUCTS_LOG_MESSAGES.RATING_UPDATED(id, averageRating));
            return product;
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_UPDATE_RATING} ${id}: ${msg}`);
            throw error;
        }
    }

    async getFeaturedProducts(limit: number = 10): Promise<ProductDocument[]> {
        try {
            return await this.productModel
                .find({ isFeatured: true, isActive: true })
                .populate('categories', 'name slug')
                .sort({ averageRating: -1, createdAt: -1 })
                .limit(limit)
                .exec();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`${PRODUCTS_ERROR_MESSAGES.FAILED_TO_FETCH_FEATURED}: ${msg}`);
            throw error;
        }
    }
}
