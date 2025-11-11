import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery, SortOrder as MongooseSortOrder } from 'mongoose';
import { Payment, PaymentDocument, PaymentStatus } from './entities/payment.entity';
import type { PaymentMethod } from './entities/payment.entity';
import { PaymobService } from './services/paymob.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatus as OrderPaymentStatus } from '../orders/entities/order.entity';
import { CreatePaymentDto, PaymentResponse } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { QueryPaymentsDto } from './dto/query-payments.dto';
import { PaymobWebhookDto } from './dto/webhook-payment.dto';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        private readonly paymobService: PaymobService,
        private readonly ordersService: OrdersService
    ) {}

    async create(createPaymentDto: CreatePaymentDto, userId: string): Promise<PaymentResponse> {
        // Validate order exists and belongs to user
        const order = await this.ordersService.findOne(createPaymentDto.orderID);
        if (!order || order.userID.toString() !== userId) {
            throw new NotFoundException('Order not found or not owned by user');
        }

        // Check if payment already exists for this order
        const existingPayment = await this.paymentModel.findOne({
            orderId: new Types.ObjectId(createPaymentDto.orderID),
            status: {
                $in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING, PaymentStatus.COMPLETED],
            },
        });

        if (existingPayment) {
            throw new BadRequestException('Payment already exists for this order');
        }

        // Create payment record
        const payment = new this.paymentModel({
            orderId: new Types.ObjectId(createPaymentDto.orderID),
            userId: new Types.ObjectId(userId),
            amount: createPaymentDto.amount,
            currency: createPaymentDto.currency || 'EGP',
            paymentMethod: createPaymentDto.paymentMethod,
            status: PaymentStatus.PENDING,
            metadata: createPaymentDto.metadata,
            walletMsisdn: createPaymentDto.walletMsisdn,
        });

        const savedPayment = await payment.save();

        // Initiate payment with Paymob
        try {
            const paymobResult = await this.paymobService.initiatePayment(
                createPaymentDto.amount,
                createPaymentDto.currency || 'EGP',
                createPaymentDto.paymentMethod,
                createPaymentDto.orderID,
                order.shippingAddress.phone || '+201234567890',
                order.shippingAddress.customerName || 'Customer',
                createPaymentDto.walletMsisdn || ''
            );

            // Update payment with Paymob details
            savedPayment.paymobOrderId = paymobResult.paymobOrderId;
            savedPayment.paymobPaymentKey = paymobResult.paymentKey;
            savedPayment.paymobIframeUrl = paymobResult.iframeUrl || '';
            savedPayment.status = PaymentStatus.PROCESSING;

            await savedPayment.save();

            return {
                paymentId: savedPayment._id as string,
                paymobOrderId: paymobResult.paymobOrderId,
                paymentKey: paymobResult.paymentKey,
                iframeUrl: paymobResult.iframeUrl,
                redirectUrl: paymobResult.redirectUrl,
                expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
            };
        } catch (error: unknown) {
            // Update payment status to failed
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            savedPayment.status = PaymentStatus.FAILED;
            savedPayment.errorMessage = errorMessage;
            await savedPayment.save();

            throw error;
        }
    }

    async findAll(queryDto: QueryPaymentsDto) {
        const {
            userId,
            orderId,
            status,
            paymentMethod,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = queryDto;

        const filter: FilterQuery<PaymentDocument> = {};

        if (userId) filter.userId = new Types.ObjectId(userId);
        if (orderId) filter.orderId = new Types.ObjectId(orderId);
        if (status) filter.status = status;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        if (startDate || endDate) {
            const createdAtCondition: { $gte?: Date; $lte?: Date } = {};
            if (startDate) createdAtCondition.$gte = new Date(startDate);
            if (endDate) createdAtCondition.$lte = new Date(endDate);
            filter.createdAt = createdAtCondition;
        }

        const sort: Record<string, MongooseSortOrder> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            this.paymentModel
                .find(filter)
                .populate('orderId', 'orderNumber totalAmount')
                .populate('userId', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.paymentModel.countDocuments(filter),
        ]);

        return {
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentModel
            .findById(id)
            .populate('orderId', 'orderNumber totalAmount')
            .populate('userId', 'name email')
            .exec();

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        return payment;
    }

    async findByOrderId(orderId: string): Promise<Payment[]> {
        return this.paymentModel
            .find({ orderId: new Types.ObjectId(orderId) })
            .sort({ createdAt: -1 })
            .exec();
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.paymentModel.findById(id);

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Update timestamps based on status
        if (updatePaymentDto.status) {
            switch (updatePaymentDto.status) {
                case PaymentStatus.COMPLETED:
                    payment.paidAt = new Date();
                    break;
                case PaymentStatus.FAILED:
                    payment.failedAt = new Date();
                    break;
                case PaymentStatus.REFUNDED:
                    payment.refundedAt = new Date();
                    break;
            }
        }

        Object.assign(payment, updatePaymentDto);
        return payment.save();
    }

    async handleWebhook(webhookData: PaymobWebhookDto): Promise<void> {
        this.logger.log(`Processing webhook for transaction ${webhookData.id}`);

        // Verify webhook signature
        const isValid = this.paymobService.verifyWebhookSignature(
            webhookData.amount_cents,
            webhookData.created_at,
            webhookData.currency,
            webhookData.error_occured,
            webhookData.has_parent_transaction,
            webhookData.id,
            webhookData.integration_id,
            webhookData.is_3d_secure,
            webhookData.is_auth,
            webhookData.is_capture,
            webhookData.is_refunded,
            webhookData.is_standalone_payment,
            webhookData.is_voided,
            webhookData.order,
            webhookData.owner,
            webhookData.pending,
            webhookData.source_data_pan,
            webhookData.source_data_sub_type,
            webhookData.source_data_type,
            webhookData.success,
            webhookData.hmac
        );

        if (!isValid) {
            this.logger.error('Invalid webhook signature');
            throw new BadRequestException('Invalid webhook signature');
        }

        // Find payment by Paymob order ID
        const payment = await this.paymentModel.findOne({
            paymobOrderId: webhookData.order,
        });

        if (!payment) {
            this.logger.error(`Payment not found for Paymob order ${webhookData.order}`);
            return;
        }

        // Update payment based on webhook data
        const updateData: Partial<Payment> = {
            paymobTransactionId: webhookData.id,
            transactionReference: webhookData.id,
            webhookData: webhookData,
        };

        if (webhookData.success === 'true') {
            updateData.status = PaymentStatus.COMPLETED;
            updateData.paidAt = new Date();
            updateData.authCode = webhookData.id;
            updateData.maskedPan = webhookData.source_data_pan;
        } else {
            updateData.status = PaymentStatus.FAILED;
            updateData.failedAt = new Date();
            updateData.errorMessage = 'Payment failed at gateway';
        }

        await this.paymentModel.findByIdAndUpdate(payment._id, updateData);

        // Update order status if payment completed
        if (updateData.status === PaymentStatus.COMPLETED) {
            await this.ordersService.update(payment.orderId.toString(), {
                paymentStatus: OrderPaymentStatus.PAID,
            });
        }

        this.logger.log(
            `Payment ${payment._id as string} updated with status ${updateData.status}`
        );
    }

    async refund(id: string, reason?: string): Promise<PaymentDocument> {
        const payment = await this.findOne(id);

        if (payment.status !== PaymentStatus.COMPLETED) {
            throw new BadRequestException('Only completed payments can be refunded');
        }

        // Update payment status
        payment.status = PaymentStatus.REFUNDED;
        payment.refundedAt = new Date();
        if (reason) {
            payment.metadata = { ...payment.metadata, refundReason: reason };
        }

        return await (payment as PaymentDocument).save();
    }

    async getPaymentStats(userId?: string): Promise<{
        statusBreakdown: Array<{ _id: PaymentStatus; count: number; totalAmount: number }>;
        methodBreakdown: Array<{ _id: PaymentMethod; count: number; totalAmount: number }>;
        totalPayments: number;
        totalAmount: number;
    }> {
        const matchStage: FilterQuery<PaymentDocument> = {};
        if (userId) {
            matchStage.userId = new Types.ObjectId(userId);
        }

        const stats = await this.paymentModel.aggregate<{
            _id: PaymentStatus;
            count: number;
            totalAmount: number;
        }>([
            { $match: matchStage },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]);

        const methodStats = await this.paymentModel.aggregate<{
            _id: PaymentMethod;
            count: number;
            totalAmount: number;
        }>([
            { $match: matchStage },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]);

        return {
            statusBreakdown: stats,
            methodBreakdown: methodStats,
            totalPayments: stats.reduce((sum, stat) => sum + stat.count, 0),
            totalAmount: stats.reduce((sum, stat) => sum + stat.totalAmount, 0),
        };
    }
}
