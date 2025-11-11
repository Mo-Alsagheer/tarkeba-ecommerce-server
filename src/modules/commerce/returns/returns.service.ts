import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Return, ReturnDocument } from './entities/return.entity';
import { ReturnStatus } from '../../../common/enums';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ProcessReturnDto } from './dto/process-return.dto';
import { QueryReturnsDto } from './dto/query-returns.dto';
import { OrdersService } from '../../commerce/sales/orders/orders.service';
import { API_RESPONSE_MESSAGES } from '../../../common/constants/api-descriptions';
import { Order } from '../../commerce/sales/orders/entities/order.entity';
import { OrderItem } from '../../commerce/sales/orders/entities/order-item.entity';
import { ReturnStatsSummary } from '../../../common/interfaces';

@Injectable()
export class ReturnsService {
    constructor(
        @InjectModel(Return.name)
        private returnModel: Model<ReturnDocument>,
        @InjectModel(OrderItem.name)
        private orderItemModel: Model<OrderItem>,
        private orderService: OrdersService
    ) {}

    async create(createReturnDto: CreateReturnDto, userID: string): Promise<Return> {
        // Verify that the user actually purchased this product in this order
        const order: Order = await this.validateOrderAndProduct(
            createReturnDto.orderID,
            createReturnDto.productID,
            userID,
            createReturnDto.quantity
        );

        // Check if return window is still valid (within 14 days)
        this.validateReturnWindow(order.createdAt);

        // Check for existing return requests for this product in this order
        await this.checkExistingReturn(createReturnDto.orderID, createReturnDto.productID, userID);

        const returnRequest = new this.returnModel({
            ...createReturnDto,
            userId: new Types.ObjectId(userID),
            orderId: new Types.ObjectId(createReturnDto.orderID),
            productId: new Types.ObjectId(createReturnDto.productID),
        });

        return returnRequest.save();
    }

    private async validateOrderAndProduct(
        orderID: string,
        productID: string,
        userID: string,
        requestedQuantity: number
    ): Promise<Order> {
        const order = await this.orderService.findOne(orderID);

        // Check if order exists and belongs to the user
        if (!order || order.userID.toString() !== userID) {
            throw new NotFoundException(API_RESPONSE_MESSAGES.RETURNS.ORDER_NOT_FOUND);
        }

        // Find the order item in the separate OrderItem collection
        const orderItem = await this.orderItemModel
            .findOne({
                orderID: new Types.ObjectId(orderID),
                productID: new Types.ObjectId(productID),
            })
            .exec();

        // Check if product exists in the order
        if (!orderItem) {
            throw new BadRequestException(API_RESPONSE_MESSAGES.RETURNS.PRODUCT_NOT_IN_ORDER);
        }

        // Check if requested quantity is valid
        if (requestedQuantity > orderItem.quantity) {
            throw new BadRequestException(
                API_RESPONSE_MESSAGES.RETURNS.INVALID_QUANTITY.replace(
                    '{requestedQuantity}',
                    String(requestedQuantity)
                ).replace('{availableQuantity}', String(orderItem.quantity))
            );
        }

        return order;
    }

    private validateReturnWindow(orderDate: Date) {
        const returnWindowDays = 14;
        const daysSinceOrder = Math.floor(
            (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if return window has expired
        if (daysSinceOrder > returnWindowDays) {
            throw new BadRequestException(
                API_RESPONSE_MESSAGES.RETURNS.RETURN_WINDOW_EXPIRED.replace(
                    '{days}',
                    returnWindowDays.toString()
                )
            );
        }
    }

    private async checkExistingReturn(
        orderID: string,
        productID: string,
        userID: string
    ): Promise<void> {
        const existingReturn = await this.returnModel.findOne({
            orderId: new Types.ObjectId(orderID),
            productId: new Types.ObjectId(productID),
            userId: new Types.ObjectId(userID),
        });

        // Check if return request already exists
        if (existingReturn) {
            throw new BadRequestException(API_RESPONSE_MESSAGES.RETURNS.DUPLICATE_RETURN);
        }
    }

    async findAll(queryDto: QueryReturnsDto) {
        const {
            page = 1,
            limit = 10,
            orderID,
            userID,
            productID,
            status,
            reason,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = queryDto;

        interface ReturnFilter {
            orderId?: Types.ObjectId;
            userId?: Types.ObjectId;
            productId?: Types.ObjectId;
            status?: ReturnStatus;
            reason?: string;
        }

        const filter: ReturnFilter = {};

        if (orderID) {
            filter.orderId = new Types.ObjectId(orderID);
        }

        if (userID) {
            filter.userId = new Types.ObjectId(userID);
        }

        if (productID) {
            filter.productId = new Types.ObjectId(productID);
        }

        if (status) {
            filter.status = status;
        }

        if (reason) {
            filter.reason = reason;
        }

        const sortOptions: Record<string, 1 | -1> = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const [returns, total] = await Promise.all([
            this.returnModel
                .find(filter)
                .populate('userId', 'username email')
                .populate('orderId', 'orderNumber')
                .populate('productId', 'name images price')
                .populate('processedBy', 'username')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.returnModel.countDocuments(filter),
        ]);

        return {
            returns,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Return> {
        const returnRequest = await this.returnModel
            .findById(id)
            .populate('userId', 'username email')
            .populate('orderId', 'orderNumber')
            .populate('productId', 'name images price')
            .populate('processedBy', 'username')
            .exec();

        if (!returnRequest) {
            throw new NotFoundException(API_RESPONSE_MESSAGES.ERROR.NOT_FOUND);
        }

        return returnRequest;
    }

    async update(id: string, updateReturnDto: UpdateReturnDto, userID: string): Promise<Return> {
        const returnRequest = await this.returnModel.findById(id);

        if (!returnRequest) {
            throw new NotFoundException(API_RESPONSE_MESSAGES.ERROR.NOT_FOUND);
        }

        // Only allow the return requester to update their own return
        if (returnRequest.userId.toString() !== userID) {
            throw new ForbiddenException(API_RESPONSE_MESSAGES.RETURNS.NOT_OWNER);
        }

        // Only allow updates if return is still pending
        if (returnRequest.status !== ReturnStatus.PENDING) {
            throw new BadRequestException(API_RESPONSE_MESSAGES.RETURNS.CANNOT_UPDATE_NON_PENDING);
        }

        const updatedReturn = await this.returnModel
            .findByIdAndUpdate(id, updateReturnDto, { new: true })
            .populate('userId', 'username email')
            .populate('orderId', 'orderNumber')
            .populate('productId', 'name images price')
            .exec();

        return updatedReturn!;
    }

    async process(
        id: string,
        processReturnDto: ProcessReturnDto,
        adminID: string
    ): Promise<Return> {
        const returnRequest = await this.returnModel.findById(id);

        if (!returnRequest) {
            throw new NotFoundException(API_RESPONSE_MESSAGES.ERROR.NOT_FOUND);
        }

        interface ProcessUpdateData {
            status: ReturnStatus;
            processedBy: Types.ObjectId;
            processedAt: Date;
            trackingNumber?: string;
            adminNotes?: string;
            refundedAt?: Date;
        }

        const updateData: ProcessUpdateData = {
            status: processReturnDto.status,
            processedBy: new Types.ObjectId(adminID),
            processedAt: new Date(),
        };

        if (processReturnDto.trackingNumber) {
            updateData.trackingNumber = processReturnDto.trackingNumber;
        }

        if (processReturnDto.adminNotes) {
            updateData.adminNotes = processReturnDto.adminNotes;
        }

        // Set refunded date if status is refunded
        if (processReturnDto.status === ReturnStatus.REFUNDED) {
            updateData.refundedAt = new Date();
        }

        const updatedReturn = await this.returnModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('userId', 'username email')
            .populate('orderId', 'orderNumber')
            .populate('productId', 'name images price')
            .populate('processedBy', 'username')
            .exec();

        return updatedReturn!;
    }

    async remove(id: string, userID: string): Promise<void> {
        const returnRequest = await this.returnModel.findById(id);

        if (!returnRequest) {
            throw new NotFoundException(API_RESPONSE_MESSAGES.ERROR.NOT_FOUND);
        }

        // Only allow the return requester to delete their own return
        if (returnRequest.userId.toString() !== userID) {
            throw new ForbiddenException(API_RESPONSE_MESSAGES.RETURNS.NOT_OWNER);
        }

        // Only allow deletion if return is still pending
        if (returnRequest.status !== ReturnStatus.PENDING) {
            throw new BadRequestException(API_RESPONSE_MESSAGES.RETURNS.CANNOT_DELETE_NON_PENDING);
        }

        await this.returnModel.findByIdAndDelete(id);
    }

    async getReturnStats(): Promise<ReturnStatsSummary> {
        const stats = await this.returnModel
            .aggregate<ReturnStatsSummary>([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalRefundAmount: { $sum: '$refundAmount' },
                    },
                },
                {
                    $group: {
                        _id: null,
                        statusBreakdown: {
                            $push: {
                                status: '$_id',
                                count: '$count',
                                totalRefundAmount: '$totalRefundAmount',
                            },
                        },
                        totalReturns: { $sum: '$count' },
                        totalRefundValue: { $sum: '$totalRefundAmount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        statusBreakdown: 1,
                        totalReturns: 1,
                        totalRefundValue: 1,
                    },
                },
            ])
            .exec();

        return (
            stats[0] ?? {
                statusBreakdown: [],
                totalReturns: 0,
                totalRefundValue: 0,
            }
        );
    }

    async getUserReturns(userID: string, queryDto: QueryReturnsDto) {
        return this.findAll({
            ...queryDto,
            userID,
        });
    }
}
