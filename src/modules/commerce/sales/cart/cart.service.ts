import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../../catalog/products/products.service';
import { CouponsService } from '../coupons/coupons.service';
import {
    CartItem,
    CartSummary,
    CartValidationResult,
    StockValidationResult,
    ApplyCouponResult,
    ApplyCouponSummary,
    CouponDetails,
    UpdatedItems,
} from '../../../../common/interfaces/cart.interface';
import { CartItemDto as CouponCartItemDto } from '../coupons/dto/apply-coupon.dto';
import { batchFetchProducts } from '../../../../common/helpers/cart.helpers';
import {
    CART_VALIDATION_MESSAGES,
    COUPON_MESSAGES,
    CART_CONFIG,
} from '../../../../common/constants/cart.constants';

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);

    constructor(
        private readonly productsService: ProductsService,
        private readonly couponsService: CouponsService
    ) {}

    /**
     * Validate cart items against current product data
     * This ensures prices and availability are up-to-date
     * Optimized with batch product fetching and variant aggregation
     */
    async validateCart(cartItems: CartItem[]): Promise<CartValidationResult> {
        const validItems: CartItem[] = [];
        const invalidItems: { productId: string; variantSize: string; reason: string }[] = [];
        const updatedItems: UpdatedItems[] = [];

        // Batch fetch products
        const { productMap } = await batchFetchProducts(cartItems, this.productsService);

        // Aggregate quantities per product+variant to check total stock requirements
        const variantQuantityMap = new Map<string, number>();
        for (const item of cartItems) {
            const key = `${item.productId}:${item.variantSize}`;
            variantQuantityMap.set(key, (variantQuantityMap.get(key) || 0) + item.quantity);
        }

        // Validate each cart item
        for (const item of cartItems) {
            const product = productMap.get(item.productId);

            // Check if product exists
            if (!product) {
                invalidItems.push({
                    productId: item.productId,
                    variantSize: item.variantSize,
                    reason: CART_VALIDATION_MESSAGES.PRODUCT_NOT_FOUND,
                });
                continue;
            }

            // Check if product is active
            if (!product.isActive) {
                invalidItems.push({
                    productId: item.productId,
                    variantSize: item.variantSize,
                    reason: CART_VALIDATION_MESSAGES.PRODUCT_NOT_AVAILABLE,
                });
                continue;
            }

            // Find the specific variant by size
            const variant = product.variants.find((v) => v.size === item.variantSize);

            if (!variant) {
                invalidItems.push({
                    productId: item.productId,
                    variantSize: item.variantSize,
                    reason: CART_VALIDATION_MESSAGES.VARIANT_NOT_FOUND(item.variantSize),
                });
                continue;
            }

            // Check total requested quantity for this product+variant across all cart items
            const key = `${item.productId}:${item.variantSize}`;
            const totalRequested = variantQuantityMap.get(key) || 0;

            if (variant.stock < totalRequested) {
                invalidItems.push({
                    productId: item.productId,
                    variantSize: item.variantSize,
                    reason: CART_VALIDATION_MESSAGES.INSUFFICIENT_STOCK(
                        variant.stock,
                        totalRequested
                    ),
                });
                continue;
            }

            // Check if price has changed
            if (item.unitPrice !== variant.price) {
                updatedItems.push({
                    productId: item.productId,
                    variantSize: item.variantSize,
                    oldPrice: item.unitPrice,
                    newPrice: variant.price,
                });

                // Update item with new price
                item.unitPrice = variant.price;
                item.totalPrice = item.quantity * variant.price;
            }

            validItems.push(item);
        }

        return { validItems, invalidItems, updatedItems };
    }

    /**
     * Calculate cart totals and summary
     */
    calculateCartSummary(cartItems: CartItem[]): CartSummary {
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

        // Calculate tax and totals
        const taxAmount = subtotal * CART_CONFIG.TAX_RATE;
        const totalAmount = subtotal + taxAmount;

        return {
            itemCount,
            subtotal,
            taxAmount,
            shippingAmount: CART_CONFIG.DEFAULT_SHIPPING,
            discountAmount: CART_CONFIG.DEFAULT_DISCOUNT,
            totalAmount,
            items: cartItems,
        };
    }

    /**
     * Validate stock availability for checkout
     */
    async validateStockForCheckout(cartItems: CartItem[]): Promise<StockValidationResult> {
        const items = cartItems.map((item) => ({
            productID: item.productId,
            quantity: item.quantity,
            size: item.variantSize,
        }));

        return await this.productsService.validateStockForCheckout(items);
    }

    /**
     * Get product details for cart items (for frontend display)
     * Optimized with batch product fetching
     */
    async enrichCartItems(cartItems: CartItem[]): Promise<CartItem[]> {
        const enrichedItems: CartItem[] = [];

        // Batch fetch products
        const { productMap } = await batchFetchProducts(cartItems, this.productsService);

        // Enrich each cart item
        for (const item of cartItems) {
            const product = productMap.get(item.productId);

            if (!product) {
                // Product not found, mark as unavailable
                enrichedItems.push({
                    ...item,
                    isAvailable: false,
                    availableStock: 0,
                });
                continue;
            }

            const variant = product.variants.find((v) => v.size === item.variantSize);

            enrichedItems.push({
                ...item,
                productName: product.name,
                productSlug: product.slug,
                productImage: product.images?.[0] || undefined,
                isAvailable: product.isActive && !!variant && variant.stock > 0,
                availableStock: variant?.stock || 0,
            });
        }

        return enrichedItems;
    }

    /**
     * Apply coupon to cart
     * Validates and calculates discount for the given coupon code
     * Optimized with batch product fetching
     */
    async applyCoupon(
        cartItems: CartItem[],
        couponCode: string,
        userId: string
    ): Promise<ApplyCouponResult> {
        try {
            // First, check if coupon exists and is valid (basic check)
            // This avoids fetching products if the coupon code is invalid
            const coupon = await this.couponsService.findByCode(couponCode);
            if (!coupon) {
                return {
                    valid: false,
                    discountAmount: 0,
                    message: COUPON_MESSAGES.INVALID_CODE,
                };
            }

            // Batch fetch products
            const { productMap } = await batchFetchProducts(cartItems, this.productsService);

            // Transform cart items to coupon service format
            const couponCartItems: CouponCartItemDto[] = cartItems.map((item) => {
                const product = productMap.get(item.productId);
                // Use first category if available, otherwise use empty string
                const categoryID =
                    product?.categories && product.categories.length > 0
                        ? product.categories[0].toString()
                        : '';
                return {
                    productID: item.productId,
                    quantity: item.quantity,
                    price: item.unitPrice,
                    categoryID,
                };
            });

            // Apply coupon through coupons service (full validation)
            const result = await this.couponsService.applyCoupon(
                { code: couponCode, cartItems: couponCartItems },
                userId
            );

            if (!result.success) {
                return {
                    valid: false,
                    discountAmount: 0,
                    message: result.message || COUPON_MESSAGES.INVALID_COUPON,
                };
            }

            return {
                valid: true,
                discountAmount: result.discountAmount,
                message: COUPON_MESSAGES.APPLIED_SUCCESS,
                couponDetails: result.coupon,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : COUPON_MESSAGES.APPLY_FAILED;
            this.logger.error(errorMessage);
            return {
                valid: false,
                discountAmount: 0,
                message: errorMessage,
            };
        }
    }

    /**
     * Prepare cart data for order creation
     */
    prepareOrderItems(cartItems: CartItem[]) {
        return cartItems.map((item) => ({
            productID: item.productId,
            variantSize: item.variantSize,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
        }));
    }

    /**
     * Apply coupon and calculate summary with discount
     * Combines coupon application with summary calculation
     */
    async applyCouponWithSummary(
        cartItems: CartItem[],
        couponCode: string,
        userId: string
    ): Promise<ApplyCouponSummary> {
        const couponResult = await this.applyCoupon(cartItems, couponCode, userId);

        if (couponResult.valid) {
            const summary = this.calculateCartSummary(cartItems);
            summary.discountAmount = couponResult.discountAmount;
            summary.totalAmount -= couponResult.discountAmount;
            summary.couponCode = couponCode;
            summary.couponDetails = couponResult.couponDetails;

            return {
                success: true,
                coupon: couponResult,
                summary,
            };
        }

        return {
            success: false,
            message: couponResult.message,
        };
    }

    /**
     * Complete checkout validation
     * Validates cart items, stock, and applies coupon if provided
     */
    async validateCompleteCheckout(
        cartItems: CartItem[],
        couponCode: string | undefined,
        userId: string
    ) {
        // Validate cart items first
        const validation = await this.validateCart(cartItems);

        if (validation.invalidItems.length > 0) {
            return {
                valid: false,
                reason: 'invalid_items' as const,
                invalidItems: validation.invalidItems,
            };
        }

        // Validate stock availability
        const stockValidation = await this.validateStockForCheckout(validation.validItems);

        if (!stockValidation.valid) {
            return {
                valid: false,
                reason: 'insufficient_stock' as const,
                unavailableItems: stockValidation.unavailableItems,
            };
        }

        // Apply coupon if provided
        const finalItems = validation.validItems;
        let couponDiscount = 0;
        let couponDetails: CouponDetails | undefined;

        if (couponCode) {
            const couponResult = await this.applyCoupon(validation.validItems, couponCode, userId);

            if (couponResult.valid) {
                couponDiscount = couponResult.discountAmount;
                couponDetails = couponResult.couponDetails;
            }
        }

        // Calculate final summary
        const summary: CartSummary = this.calculateCartSummary(finalItems);
        summary.discountAmount = couponDiscount;
        summary.totalAmount -= couponDiscount;
        if (couponCode && couponDetails) {
            summary.couponCode = couponCode;
            summary.couponDetails = couponDetails;
        }

        return {
            valid: true,
            summary,
            orderItems: this.prepareOrderItems(finalItems),
        };
    }
}
