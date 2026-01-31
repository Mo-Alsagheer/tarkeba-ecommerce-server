import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { OrderStatus } from '../../modules/commerce/sales/orders/entities/order.entity';
//import { ProductsService } from '../../models/products/products.service';

/**
 * Generate unique order number based on date and sequence
 * Format: ORD + YYMMDD + 4-digit sequence
 * Example: ORD241014001
 */
export async function generateOrderNumber(orderModel: Model<any>): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Get count of orders today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todayOrderCount = await orderModel.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const sequence = (todayOrderCount + 1).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${sequence}`;
}

/**
 * Validate order status transitions
 * Ensures orders can only move through valid status flows
 */
export function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
        [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
        [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
        [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
        throw new BadRequestException(
            `Invalid status transition from ${currentStatus} to ${newStatus}`
        );
    }
}

/**
 * Validate cart stock availability before checkout
 * @param cartItems - Array of cart items from frontend with productId and quantity
 * @param productsService - Products service instance
 */
// export async function validateCartStock(
//     cartItems: Array<{ productId: string; quantity: number }>,
//     productsService: ProductsService
// ): Promise<{
//     valid: boolean;
//     unavailableItems: {
//         productId: string;
//         requested: number;
//         available: number;
//     }[];
// }> {
//     return await productsService.validateStockForCheckout(cartItems);
// }
