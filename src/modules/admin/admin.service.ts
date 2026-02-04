import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../identity/users/entities/user.entity';
import { Order } from '../commerce/sales/orders/entities/order.entity';
import { OrderItem } from '../commerce/sales/orders/entities/order-item.entity';
import { Product } from '../commerce/catalog/products/entities/product.entity';
import { RefreshToken } from '../identity/auth/entities/refresh-token.entity';
import { OrderStatus } from '../../common/enums';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>
    ) {}

    // Dashboard Analytics
    async getDashboardAnalytics() {
        const [
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
            recentOrders,
            topProducts,
            orderStatusBreakdown,
            userGrowth,
        ] = await Promise.all([
            this.getTotalUsers(),
            this.getTotalOrders(),
            this.getTotalProducts(),
            this.getTotalRevenue(),
            this.getRecentOrders(5),
            this.getTopProducts(),
            this.getOrderStatusBreakdown(),
            this.getUserGrowth(30),
        ]);

        return {
            overview: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue,
            },
            recentOrders,
            topProducts,
            orderStatusBreakdown,
            userGrowth,
        };
    }

    // Get total users count
    async getTotalUsers() {
        return await this.userModel.countDocuments();
    }

    // Get total orders count
    async getTotalOrders() {
        return await this.orderModel.countDocuments();
    }

    // Get total products count
    async getTotalProducts() {
        return await this.productModel.countDocuments();
    }

    // Get total revenue
    async getTotalRevenue() {
        const result: { _id: null; total: number }[] = await this.orderModel.aggregate([
            {
                $match: {
                    status: { $in: [OrderStatus.DELIVERED] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                },
            },
        ]);

        return result.length > 0 ? result[0].total : 0;
    }

    // Get recent orders
    async getRecentOrders(limit: number = 10) {
        return await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userID', 'username email');
    }

    // Get all orders with pagination
    async getAllOrders(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const total = await this.orderModel.countDocuments().exec();
        this.logger.log(`Total orders count: ${total}`);

        const orders = await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userID', 'username email')
            .exec();

        this.logger.log(`Found ${orders.length} orders for page ${page}`);

        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Get order by ID with items
    async getOrderById(id: string) {
        const order = await this.orderModel
            .findById(id)
            .populate('userID', 'username email')
            .exec();

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const orderItems = await this.orderItemModel
            .find({ orderID: order._id })
            .populate('productID', 'name slug images price')
            .exec();

        return {
            order,
            items: orderItems,
        };
    }

    // Update order status
    async updateOrderStatus(id: string, status: OrderStatus) {
        const order = await this.orderModel.findById(id).exec();

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = status;
        await order.save();

        this.logger.log(`Order ${id} status updated to ${status}`);

        return {
            message: 'Order status updated successfully',
            order,
        };
    }

    // Get top selling products
    async getTopProducts(limit: number = 10) {
        // First, let's check what we have in order items
        const sampleItem = await this.orderItemModel.findOne().exec();
        if (sampleItem) {
            this.logger.debug(
                `Sample OrderItem - productID type: ${typeof sampleItem.productID}, value: ${sampleItem.productID}`
            );
        }

        const results = await this.orderItemModel.aggregate<{
            _id: Types.ObjectId;
            totalQuantity: number;
            totalRevenue: number;
            variantBreakdown: Array<{ size: string; quantity: number; revenue: number }>;
            productName?: string;
            productSlug?: string;
            productImage?: string;
            isActive?: boolean;
        }>([
            {
                $group: {
                    _id: '$productID',
                    totalQuantity: { $sum: '$quantity' },
                    totalRevenue: { $sum: '$totalPrice' },
                    variantBreakdown: {
                        $push: {
                            size: '$size',
                            quantity: '$quantity',
                            revenue: '$totalPrice',
                        },
                    },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit },
            {
                $addFields: {
                    _id: { $toObjectId: '$_id' },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    variantBreakdown: {
                        $reduce: {
                            input: '$variantBreakdown',
                            initialValue: [],
                            in: {
                                $let: {
                                    vars: {
                                        existing: {
                                            $filter: {
                                                input: '$$value',
                                                as: 'item',
                                                cond: { $eq: ['$$item.size', '$$this.size'] },
                                            },
                                        },
                                    },
                                    in: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$$existing' }, 0] },
                                            then: {
                                                $concatArrays: [
                                                    {
                                                        $filter: {
                                                            input: '$$value',
                                                            as: 'item',
                                                            cond: { $ne: ['$$item.size', '$$this.size'] },
                                                        },
                                                    },
                                                    [
                                                        {
                                                            size: '$$this.size',
                                                            quantity: {
                                                                $add: [
                                                                    { $arrayElemAt: ['$$existing.quantity', 0] },
                                                                    '$$this.quantity',
                                                                ],
                                                            },
                                                            revenue: {
                                                                $add: [
                                                                    { $arrayElemAt: ['$$existing.revenue', 0] },
                                                                    '$$this.revenue',
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                ],
                                            },
                                            else: {
                                                $concatArrays: [
                                                    '$$value',
                                                    [
                                                        {
                                                            size: '$$this.size',
                                                            quantity: '$$this.quantity',
                                                            revenue: '$$this.revenue',
                                                        },
                                                    ],
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: '$product.name',
                    productSlug: '$product.slug',
                    productImage: { $arrayElemAt: ['$product.images', 0] },
                    isActive: '$product.isActive',
                    totalQuantity: 1,
                    totalRevenue: 1,
                    variantBreakdown: 1,
                    // Debug: include the full product object temporarily
                    productDebug: '$product',
                },
            },
        ]);

        this.logger.log(`Found ${results.length} top products`);
        if (results.length > 0) {
            this.logger.debug(`First product result:`, JSON.stringify(results[0], null, 2));
        }
        return results;
    }

    // Get order status breakdown
    async getOrderStatusBreakdown() {
        return await this.orderModel.aggregate<{ _id: string; count: number }>([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
    }

    // Get user growth (last N days)
    async getUserGrowth(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return await this.userModel.aggregate<{ _id: string; count: number }>([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }

    // Get all users with pagination
    async getAllUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const users = await this.userModel.find().select('-password').skip(skip).limit(limit);
        const total = await this.userModel.countDocuments();

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // Delete user
    async deleteUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Revoke all refresh tokens
        await this.refreshTokenModel.deleteMany({ userId });

        // Delete user
        await this.userModel.findByIdAndDelete(userId);
        this.logger.log(`User deleted: ${user.email}`);
        return { message: 'User deleted successfully' };
    }

    // Get sales analytics
    async getSalesAnalytics(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return await this.orderModel.aggregate<{
            _id: string;
            totalSales: number;
            orderCount: number;
        }>([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: { $in: [OrderStatus.DELIVERED] },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }
}
