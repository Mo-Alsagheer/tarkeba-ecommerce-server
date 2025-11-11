import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Order } from '../../commerce/sales/orders/entities/order.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Order.name) private orderModel: Model<Order>
    ) {}

    // Get user profile
    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Update user profile
    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Update username if provided
        if (dto.username) {
            user.username = dto.username;
        }

        // Update password if provided
        if (dto.newPassword && dto.currentPassword) {
            const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new BadRequestException('Current password is incorrect');
            }
            user.password = await bcrypt.hash(dto.newPassword, 12);
        }

        await user.save();
        this.logger.log(`Profile updated for user: ${user.email}`);
        return { message: 'Profile updated successfully' };
    }

    // Get user's order history
    async getOrderHistory(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const orders = await this.orderModel
            .find({ userID: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('items.product');

        const total = await this.orderModel.countDocuments({ userID: userId });

        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
}
