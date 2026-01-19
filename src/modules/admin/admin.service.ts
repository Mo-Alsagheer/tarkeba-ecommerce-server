import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
            this.getTopProducts(5),
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

    // Get top selling products
    async getTopProducts(limit: number = 10) {
        return await this.orderItemModel.aggregate<{
            _id: string;
            totalQuantity: number;
            totalRevenue: number;
        }>([
            {
                $group: {
                    _id: '$productID',
                    totalQuantity: { $sum: '$quantity' },
                    totalRevenue: { $sum: '$totalPrice' },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    productName: '$product.name',
                    productSlug: '$product.slug',
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
        ]);
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
