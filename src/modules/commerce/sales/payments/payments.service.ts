import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery, SortOrder as MongooseSortOrder } from 'mongoose';
import {
    Payment,
    PaymentDocument,
    PaymentStatus,
    PaymentMethod,
    PaymentProvider,
} from './entities/payment.entity';
import { PaymobService } from './services/paymob.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../../catalog/products/products.service';
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
        private readonly ordersService: OrdersService,
        private readonly productsService: ProductsService
    ) {}

    async create(createPaymentDto: CreatePaymentDto, userId: string): Promise<PaymentResponse> {
        // Validate order exists
        const order = await this.ordersService.findOne(createPaymentDto.orderID);
        if (!order) {
            throw new NotFoundException('Order not found');
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

        // Handle CASH ON DELIVERY
        if (createPaymentDto.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
            const payment = new this.paymentModel({
                orderId: new Types.ObjectId(createPaymentDto.orderID),
                userId: new Types.ObjectId(userId),
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency || 'EGP',
                paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
                provider: PaymentProvider.INTERNAL,
                status: PaymentStatus.PENDING,
                metadata: createPaymentDto.metadata,
            });

            const savedPayment = await payment.save();

            this.logger.log('Cash on delivery payment created', {
                paymentId: savedPayment._id,
                orderId: createPaymentDto.orderID,
            });

            return {
                paymentId: savedPayment._id as string,
                paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
                status: PaymentStatus.PENDING,
                message: 'Cash on delivery confirmed. Payment will be collected upon delivery.',
            };
        }

        // Handle WALLET payment
        if (createPaymentDto.paymentMethod === PaymentMethod.WALLET) {
            if (!createPaymentDto.walletMsisdn) {
                throw new BadRequestException(
                    'Wallet phone number (walletMsisdn) is required for wallet payments'
                );
            }

            const payment = new this.paymentModel({
                orderId: new Types.ObjectId(createPaymentDto.orderID),
                userId: new Types.ObjectId(userId),
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency || 'EGP',
                paymentMethod: PaymentMethod.WALLET,
                provider: PaymentProvider.PAYMOB,
                status: PaymentStatus.PENDING,
                walletMsisdn: createPaymentDto.walletMsisdn,
                metadata: createPaymentDto.metadata,
            });

            const savedPayment = await payment.save();

            try {
                const userEmail = 'customer@example.com';
                const userName = order.shippingAddress?.customerName || 'Customer User';

                this.logger.log('Initiating wallet payment with Paymob', {
                    orderId: createPaymentDto.orderID,
                    amount: createPaymentDto.amount,
                    walletMsisdn: createPaymentDto.walletMsisdn,
                });

                const paymobResult = await this.paymobService.initiateWalletPayment(
                    createPaymentDto.amount,
                    createPaymentDto.currency || 'EGP',
                    createPaymentDto.orderID,
                    userEmail,
                    userName,
                    createPaymentDto.walletMsisdn
                );

                // Update payment with Paymob details
                savedPayment.paymobOrderId = paymobResult.paymobOrderId;
                savedPayment.paymobPaymentKey = paymobResult.paymentKey;
                savedPayment.status = PaymentStatus.PROCESSING;
                await savedPayment.save();

                return {
                    paymentId: savedPayment._id as string,
                    paymobOrderId: paymobResult.paymobOrderId,
                    paymentKey: paymobResult.paymentKey,
                    redirectUrl: paymobResult.redirectUrl,
                    expiresAt: new Date(Date.now() + 3600000),
                };
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                savedPayment.status = PaymentStatus.FAILED;
                savedPayment.errorMessage = errorMessage;
                await savedPayment.save();
                throw error;
            }
        }

        throw new BadRequestException('Invalid payment method. Use "wallet" or "cash_on_delivery"');
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

    getPaymentMethods() {
        return [
            {
                value: PaymentMethod.WALLET,
                label: 'Wallet',
                provider: PaymentProvider.PAYMOB,
            },
            {
                value: PaymentMethod.CASH_ON_DELIVERY,
                label: 'Cash on delivery',
                provider: PaymentProvider.INTERNAL,
            },
        ];
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

            // Reduce stock after successful payment for wallet payments
            if (payment.paymentMethod === PaymentMethod.WALLET) {
                try {
                    const orderItems = await this.ordersService.getOrderItems(
                        payment.orderId.toString()
                    );
                    
                    const stockItems = orderItems.map((item) => ({
                        productID: item.productID.toString(),
                        quantity: item.quantity,
                        size: item.size,
                    }));

                    await this.productsService.reduceStockForOrder(stockItems);
                    this.logger.log(
                        `Stock reduced for order ${payment.orderId.toString()} after successful wallet payment`
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to reduce stock for order ${payment.orderId.toString()}: ${error instanceof Error ? error.message : String(error)}`
                    );
                    // Note: Payment is still marked as completed, but stock reduction failed
                    // This should be handled by manual intervention or retry mechanism
                }
            }
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
