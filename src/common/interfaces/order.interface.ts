import { OrderStatus, PaymentStatus, ShippingMethod } from '../enums';
import { ObjectId, PaginatedResponse, SearchQuery, OrderTotals, OrderItem } from '../types';

export interface IOrder {
    id: ObjectId;
    orderNumber: string;
    userId: ObjectId;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    items: OrderItem[];
    totals: OrderTotals;
    shippingAddress: {
        firstName: string;
        lastName: string;
        company?: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        company?: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    shippingMethod: ShippingMethod;
    trackingNumber?: string;
    notes?: string;
    couponCode?: string;
    discountAmount: number;
    estimatedDeliveryDate?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderService {
    create(orderData: Partial<IOrder>): Promise<IOrder>;
    findById(id: string, userId?: string): Promise<IOrder | null>;
    findByOrderNumber(orderNumber: string): Promise<IOrder | null>;
    update(id: string, updateData: Partial<IOrder>): Promise<IOrder>;
    cancel(id: string, reason?: string): Promise<IOrder>;
    findAll(userId?: string, query?: SearchQuery): Promise<PaginatedResponse<IOrder>>;
    updateStatus(id: string, status: OrderStatus): Promise<IOrder>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<IOrder>;
    addTrackingNumber(id: string, trackingNumber: string): Promise<IOrder>;
    getOrderItems(orderId: string): Promise<any[]>;
    checkout(userId: string, checkoutData: any): Promise<IOrder>;
    calculateTotals(
        items: OrderItem[],
        shippingAmount?: number,
        discountAmount?: number
    ): OrderTotals;
}

export interface IOrderRepository {
    create(orderData: Partial<IOrder>): Promise<IOrder>;
    findById(id: string): Promise<IOrder | null>;
    findByOrderNumber(orderNumber: string): Promise<IOrder | null>;
    update(id: string, updateData: Partial<IOrder>): Promise<IOrder>;
    delete(id: string): Promise<boolean>;
    findMany(query: any, options?: any): Promise<IOrder[]>;
    count(query?: any): Promise<number>;
    findByUserId(userId: string, options?: any): Promise<IOrder[]>;
    findByStatus(status: OrderStatus, options?: any): Promise<IOrder[]>;
}

export interface IOrderItem {
    id: ObjectId;
    orderId: ObjectId;
    productId: ObjectId;
    productName: string;
    productSlug: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productSnapshot: {
        description: string;
        categories: ObjectId[];
        attributes?: Record<string, any>;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ICheckoutData {
    items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    shippingMethod: ShippingMethod;
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
    taxAmount?: number;
    shippingAmount?: number;
    discountAmount?: number;
}
