import { OrderStatus, PaymentStatus, ShippingMethod } from '../enums';
import { ObjectId } from './common.types';
import { UserAddress } from './user.types';

export type OrderItem = {
    productID: ObjectId;
    productName: string;
    productSlug: string;
    productImage?: string;
    variantID?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productSnapshot: {
        description: string;
        categories: ObjectId[];
        attributes?: Record<string, any>;
    };
};

export type OrderTotals = {
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
};

export type OrderShipping = {
    method: ShippingMethod;
    carrier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    address: UserAddress;
};

export type OrderPayment = {
    method: string;
    provider: string;
    transactionID?: string;
    paymentIntentID?: string;
    status: PaymentStatus;
    paidAt?: Date;
    amount: number;
    currency: string;
};

export type OrderHistory = {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: ObjectId;
};

export type OrderSummary = {
    id: ObjectId;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    itemCount: number;
    createdAt: Date;
    estimatedDeliveryDate?: Date;
};

export type ValidatedCartItem = {
    productID: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    size: string;
    product: {
        name: string;
        slug: string;
        images?: string[];
        description: string;
        categories: ObjectId[];
    };
};

export type CheckoutData = {
    items: Array<{
        productID: string;
        variantID?: string;
        quantity: number;
    }>;
    shippingAddress: UserAddress;
    billingAddress?: UserAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
};

export type OrderStats = {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
};

export type PaginatedOrdersResponse<T = OrderSummary> = {
    orders: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
