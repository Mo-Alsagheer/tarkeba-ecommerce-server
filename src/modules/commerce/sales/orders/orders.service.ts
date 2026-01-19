import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder as MongooseSortOrder, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './entities/order.entity';
import { OrderItem, OrderItemDocument } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { ProductsService } from '../../catalog/products/products.service';
import { PaymentMethod } from '../payments/entities/payment.entity';
import {
    generateOrderNumber,
    validateStatusTransition,
} from '../../../../common/helpers/order.helpers';
import { OrderSortBy, SortOrder } from '../../../../common/enums';
import { ORDERS_LOG_MESSAGES, ORDERS_ERROR_MESSAGES } from '../../../../common/constants';
import { PaginatedOrdersResponse, ValidatedCartItem } from '../../../../common/types';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(OrderItem.name)
        private orderItemModel: Model<OrderItemDocument>,
        private productsService: ProductsService
    ) {}

    // ==================== ORDER MANAGEMENT ====================

    async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        try {
            // Generate unique order number
            const orderNumber = await generateOrderNumber(this.orderModel);

            const orderData = {
                ...createOrderDto,
                orderNumber,
                userID: new Types.ObjectId(createOrderDto.userID),
            };

            const order = new this.orderModel(orderData);
            const savedOrder = await order.save();

            this.logger.log(ORDERS_LOG_MESSAGES.ORDER_CREATED(savedOrder.orderNumber));
            return savedOrder;
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_CREATE_ORDER);
            throw error;
        }
    }

    async findAll(queryDto: QueryOrderDto): Promise<PaginatedOrdersResponse<Order>> {
        const {
            page = 1,
            limit = 10,
            search,
            userID,
            status,
            paymentStatus,
            startDate,
            endDate,
            sortBy = OrderSortBy.CREATED_AT,
            sortOrder = SortOrder.DESC,
        } = queryDto;

        const skip = (page - 1) * limit;

        // Build Mongoose filter object
        const filters: FilterQuery<OrderDocument> = {};

        if (search) {
            filters.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                {
                    'shippingAddress.firstName': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'shippingAddress.lastName': {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ];
        }

        if (userID) {
            filters.userID = new Types.ObjectId(userID);
        }

        if (status) {
            filters.status = status;
        }

        if (paymentStatus) {
            filters.paymentStatus = paymentStatus;
        }

        if (startDate || endDate) {
            const createdAtCondition: {
                $gte?: Date;
                $lte?: Date;
            } = {};
            if (startDate) createdAtCondition.$gte = new Date(startDate);
            if (endDate) createdAtCondition.$lte = new Date(endDate);
            filters.createdAt = createdAtCondition;
        }

        // Build sort object with proper typing
        const sortOptions: Record<string, MongooseSortOrder> = {
            [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
        };

        try {
            const [orders, total] = await Promise.all([
                this.orderModel
                    .find(filters)
                    .populate('userID', 'username email')
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.orderModel.countDocuments(filters),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                orders,
                total,
                page,
                limit,
                totalPages,
            };
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_FETCH_ORDERS);
            throw error;
        }
    }

    async findOne(id: string): Promise<Order> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(ORDERS_ERROR_MESSAGES.INVALID_ORDER_ID);
        }

        try {
            const order = await this.orderModel
                .findById(id)
                .populate('userID', 'username email')
                .exec();

            if (!order) {
                throw new NotFoundException(ORDERS_ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            return order;
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_FETCH_ORDER(id));
            throw error;
        }
    }

    async findByOrderNumber(orderNumber: string): Promise<Order> {
        try {
            const order = await this.orderModel
                .findOne({ orderNumber })
                .populate('userID', 'username email')
                .exec();

            if (!order) {
                throw new NotFoundException(ORDERS_ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            return order;
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_FETCH_ORDER_BY_NUMBER(orderNumber));
            throw error;
        }
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(ORDERS_ERROR_MESSAGES.INVALID_ORDER_ID);
        }

        try {
            const existingOrder = await this.orderModel.findById(id);
            if (!existingOrder) {
                throw new NotFoundException(ORDERS_ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            // Validate status transitions
            if (updateOrderDto.status) {
                validateStatusTransition(existingOrder.status, updateOrderDto.status);
            }

            // Handle status-specific updates
            if (updateOrderDto.status === OrderStatus.DELIVERED && !updateOrderDto.deliveredAt) {
                updateOrderDto.deliveredAt = new Date().toISOString();
            }

            if (updateOrderDto.status === OrderStatus.CANCELLED && !updateOrderDto.cancelledAt) {
                updateOrderDto.cancelledAt = new Date().toISOString();
            }

            const order = (await this.orderModel
                .findByIdAndUpdate(id, updateOrderDto, { new: true })
                .populate('userID', 'username email')
                .exec()) as Order;

            this.logger.log(ORDERS_LOG_MESSAGES.ORDER_UPDATED(order.orderNumber));
            return order;
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_UPDATE_ORDER(id));
            throw error;
        }
    }

    async cancel(id: string, reason?: string): Promise<Order> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(ORDERS_ERROR_MESSAGES.INVALID_ORDER_ID);
        }

        try {
            const order = await this.orderModel.findById(id);
            if (!order) {
                throw new NotFoundException(ORDERS_ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            if (order.status === OrderStatus.CANCELLED) {
                throw new BadRequestException(ORDERS_ERROR_MESSAGES.ORDER_ALREADY_CANCELLED);
            }

            if (order.status === OrderStatus.DELIVERED) {
                throw new BadRequestException(ORDERS_ERROR_MESSAGES.CANNOT_CANCEL_DELIVERED_ORDER);
            }

            const updatedOrder = (await this.orderModel
                .findByIdAndUpdate(
                    id,
                    {
                        status: OrderStatus.CANCELLED,
                        cancelledAt: new Date(),
                        cancelReason: reason,
                    },
                    { new: true }
                )
                .populate('userID', 'username email')
                .exec()) as Order;

            this.logger.log(ORDERS_LOG_MESSAGES.ORDER_CANCELLED(updatedOrder.orderNumber));
            return updatedOrder;
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_CANCEL_ORDER(id));
            throw error;
        }
    }

    async getOrderItems(orderID: string): Promise<OrderItem[]> {
        if (!Types.ObjectId.isValid(orderID)) {
            throw new BadRequestException(ORDERS_ERROR_MESSAGES.INVALID_ORDER_ID);
        }

        try {
            return await this.orderItemModel
                .find({ orderID: new Types.ObjectId(orderID) })
                .populate('productID', 'name slug images')
                .exec();
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_TO_FETCH_ORDER_ITEMS(orderID));
            throw error;
        }
    }

    // ==================== CHECKOUT PROCESS ====================

    async checkout(
        userID: string,
        checkoutDto: CheckoutDto
    ): Promise<{
        order: Order;
        paymentRequired: boolean;
        paymentMethod: PaymentMethod;
        message?: string;
    }> {
        if (!Types.ObjectId.isValid(userID)) {
            throw new BadRequestException(ORDERS_ERROR_MESSAGES.INVALID_USER_ID);
        }

        if (!checkoutDto.cartItems || checkoutDto.cartItems.length === 0) {
            throw new BadRequestException(ORDERS_ERROR_MESSAGES.CART_IS_EMPTY);
        }

        try {
            // Validate cart items and calculate totals
            let subtotal = 0;
            const validatedItems: ValidatedCartItem[] = [];

            // Batch fetch all products to optimize database queries
            const productIds = checkoutDto.cartItems.map((item) => item.productID);
            const products = await this.productsService.findByIDs(productIds);
            const productMap = new Map(
                products.map((p) => [(p._id as Types.ObjectId).toString(), p])
            );

            for (const cartItem of checkoutDto.cartItems) {
                // Validate product exists and is active
                const product = productMap.get(cartItem.productID);
                if (!product) {
                    throw new BadRequestException(
                        ORDERS_ERROR_MESSAGES.PRODUCT_NOT_FOUND(cartItem.productID)
                    );
                }

                if (!product.isActive) {
                    throw new BadRequestException(
                        ORDERS_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE(product.name)
                    );
                }

                // Find the matching variant for price validation
                const variant = product.variants.find((v) => v.size === cartItem.size);

                if (!variant) {
                    throw new BadRequestException(
                        ORDERS_ERROR_MESSAGES.VARIANT_NOT_FOUND(product.name)
                    );
                }

                // Validate price hasn't changed
                if (cartItem.unitPrice !== variant.price) {
                    throw new BadRequestException(
                        ORDERS_ERROR_MESSAGES.PRICE_CHANGED(
                            product.name,
                            variant.size,
                            variant.price,
                            cartItem.unitPrice
                        )
                    );
                }

                validatedItems.push({
                    productID: (product._id as Types.ObjectId).toString(),
                    quantity: cartItem.quantity,
                    unitPrice: cartItem.unitPrice,
                    totalPrice: cartItem.totalPrice,
                    size: cartItem.size,
                    product: {
                        name: product.name,
                        slug: product.slug,
                        images: product.images,
                        description: product.description,
                        categories: product.categories,
                    },
                });

                subtotal += cartItem.totalPrice;
            }

            // Validate stock availability
            const stockItems = validatedItems.map((item) => ({
                productID: item.productID,
                quantity: item.quantity,
                size: item.size,
            }));

            const stockValidation = await this.productsService.validateStockForCheckout(stockItems);
            if (!stockValidation.valid) {
                throw new BadRequestException(
                    ORDERS_ERROR_MESSAGES.INSUFFICIENT_STOCK(stockValidation.unavailableItems)
                );
            }

            // Calculate totals (you can add tax/shipping logic here)
            const taxAmount = checkoutDto.taxAmount || 0;
            const shippingAmount = checkoutDto.shippingAmount || 0;
            const discountAmount = checkoutDto.discountAmount || 0;
            const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

            // Create order
            const orderData: CreateOrderDto = {
                userID,
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
                shippingAddress: checkoutDto.shippingAddress,
                notes: checkoutDto.notes,
            };

            const order = await this.create(orderData);

            // Create order items
            const orderItemPromises = validatedItems.map((item) =>
                this.orderItemModel.create({
                    orderID: order._id,
                    productID: item.productID,
                    productName: item.product.name,
                    productSlug: item.product.slug,
                    productImage: item.product.images?.[0],
                    size: item.size,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    productSnapshot: {
                        description: item.product.description,
                        categories: item.product.categories,
                    },
                })
            );
            await Promise.all(orderItemPromises);

            // Handle payment method
            if (checkoutDto.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
                // For COD, complete the order immediately
                await this.productsService.reduceStockForOrder(stockItems);

                this.logger.log(
                    ORDERS_LOG_MESSAGES.CHECKOUT_COMPLETED(userID, order.orderNumber)
                );

                return {
                    order,
                    paymentRequired: false,
                    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
                    message: 'Order placed successfully. Payment will be collected on delivery.',
                };
            } else if (checkoutDto.paymentMethod === PaymentMethod.WALLET) {
                // For wallet, don't reduce stock yet - wait for payment confirmation
                // Stock will be reduced after successful payment
                this.logger.log(
                    `Order ${order.orderNumber} created, awaiting wallet payment confirmation`
                );

                return {
                    order,
                    paymentRequired: true,
                    paymentMethod: PaymentMethod.WALLET,
                    message:
                        'Order created. Please complete payment to confirm your order.',
                };
            } else {
                throw new BadRequestException('Invalid payment method');
            }
        } catch (error: unknown) {
            this.logger.error(ORDERS_LOG_MESSAGES.FAILED_CHECKOUT(userID));
            throw error;
        }
    }
}
