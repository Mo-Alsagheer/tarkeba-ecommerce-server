import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, FilterQuery, Types } from 'mongoose';
import { Coupon, CouponDocument, CouponType, CouponStatus } from './entities/coupon.entity';
import { CouponUsage, CouponUsageDocument } from './entities/coupon-usage.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApplyCouponDto, CouponApplicationResult, CartItemDto } from './dto/apply-coupon.dto';
import { QueryCouponsDto } from './dto/query-coupons.dto';
import {
    ICouponUsageStats,
    ICouponsListResponse,
    ICouponValidationResult,
    ICouponUsageStatsResponse,
} from '../../../../common/interfaces';
import { COUPONS_ERROR_MESSAGES } from '../../../../common/constants';

@Injectable()
export class CouponsService {
    constructor(
        @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
        @InjectModel(CouponUsage.name)
        private couponUsageModel: Model<CouponUsageDocument>
    ) {}

    async create(createCouponDto: CreateCouponDto, createdBy: string): Promise<Coupon> {
        // Check if coupon code already exists
        const existingCoupon = await this.couponModel.findOne({
            code: createCouponDto.code.toUpperCase(),
        });

        if (existingCoupon) {
            throw new ConflictException(COUPONS_ERROR_MESSAGES.COUPON_CODE_ALREADY_EXISTS);
        }

        // Validate dates
        if (createCouponDto.startDate >= createCouponDto.expiryDate) {
            throw new BadRequestException(COUPONS_ERROR_MESSAGES.START_DATE_BEFORE_EXPIRY);
        }

        // Validate percentage values
        if (createCouponDto.type === CouponType.PERCENTAGE && createCouponDto.value > 100) {
            throw new BadRequestException(COUPONS_ERROR_MESSAGES.PERCENTAGE_EXCEEDS_100);
        }

        const coupon = new this.couponModel({
            ...createCouponDto,
            code: createCouponDto.code.toUpperCase(),
            createdBy,
        });

        return coupon.save();
    }

    async findAll(queryDto: QueryCouponsDto): Promise<ICouponsListResponse> {
        const { page = 1, limit = 10, status, type, code, search, activeOnly } = queryDto;
        const skip = (page - 1) * limit;

        // Build filter query
        const filter: FilterQuery<CouponDocument> = {};

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (code) filter.code = { $regex: code, $options: 'i' };
        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
            ];
        }

        if (activeOnly) {
            const now = new Date();
            filter.status = CouponStatus.ACTIVE;
            filter.startDate = { $lte: now };
            filter.expiryDate = { $gte: now };
        }

        const [coupons, total] = await Promise.all([
            this.couponModel
                .find(filter)
                .populate('createdBy', 'username email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.couponModel.countDocuments(filter),
        ]);

        return {
            data: coupons,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Coupon> {
        const coupon = await this.couponModel
            .findById(id)
            .populate('createdBy', 'username email')
            .exec();

        if (!coupon) {
            throw new NotFoundException(COUPONS_ERROR_MESSAGES.COUPON_NOT_FOUND);
        }

        return coupon;
    }

    async findByCode(code: string): Promise<Coupon> {
        const coupon = await this.couponModel.findOne({ code: code.toUpperCase() }).exec();

        if (!coupon) {
            throw new NotFoundException(COUPONS_ERROR_MESSAGES.COUPON_NOT_FOUND);
        }

        return coupon;
    }

    async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        // Validate dates if provided
        if (updateCouponDto.startDate && updateCouponDto.expiryDate) {
            if (updateCouponDto.startDate >= updateCouponDto.expiryDate) {
                throw new BadRequestException(COUPONS_ERROR_MESSAGES.START_DATE_BEFORE_EXPIRY);
            }
        }

        // Validate percentage values
        if (
            updateCouponDto.type === CouponType.PERCENTAGE &&
            updateCouponDto.value &&
            updateCouponDto.value > 100
        ) {
            throw new BadRequestException(COUPONS_ERROR_MESSAGES.PERCENTAGE_EXCEEDS_100);
        }

        const coupon = await this.couponModel
            .findByIdAndUpdate(id, updateCouponDto, { new: true })
            .populate('createdBy', 'username email')
            .exec();

        if (!coupon) {
            throw new NotFoundException(COUPONS_ERROR_MESSAGES.COUPON_NOT_FOUND);
        }

        return coupon;
    }

    async remove(id: string): Promise<void> {
        const result = await this.couponModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(COUPONS_ERROR_MESSAGES.COUPON_NOT_FOUND);
        }

        // Also remove all usage records for this coupon
        await this.couponUsageModel.deleteMany({ couponID: id });
    }

    async applyCoupon(
        applyCouponDto: ApplyCouponDto,
        userID: string
    ): Promise<CouponApplicationResult> {
        const { code, cartItems } = applyCouponDto;

        // Find and validate coupon
        const coupon = await this.couponModel
            .findOne({
                code: code.toUpperCase(),
            })
            .exec();

        if (!coupon) {
            return {
                success: false,
                discountAmount: 0,
                originalAmount: 0,
                finalAmount: 0,
                message: COUPONS_ERROR_MESSAGES.INVALID_COUPON_CODE,
            };
        }

        // Check coupon validity
        const validationResult = await this.validateCoupon(coupon, userID, cartItems);
        if (!validationResult.valid) {
            return {
                success: false,
                discountAmount: 0,
                originalAmount: 0,
                finalAmount: 0,
                message: validationResult.message,
            };
        }

        // Calculate discount
        const originalAmount = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        const discountAmount = this.calculateDiscount(coupon, cartItems, originalAmount);
        const finalAmount = Math.max(0, originalAmount - discountAmount);

        return {
            success: true,
            discountAmount,
            originalAmount,
            finalAmount,
            coupon: {
                id: String(coupon._id),
                code: coupon.code,
                description: coupon.description,
                type: coupon.type,
                value: coupon.value,
            },
        };
    }

    async recordCouponUsage(
        couponID: string,
        userID: string,
        orderID: string,
        discountAmount: number,
        originalAmount: number,
        finalAmount: number,
        session?: ClientSession
    ): Promise<void> {
        const couponUsage = new this.couponUsageModel({
            couponID,
            userID,
            orderID,
            discountAmount,
            originalAmount,
            finalAmount,
        });

        await couponUsage.save({ session });

        // Increment usage count
        await this.couponModel.findByIdAndUpdate(
            couponID,
            { $inc: { usageCount: 1 } },
            { session }
        );
    }

    private async validateCoupon(
        coupon: CouponDocument,
        userID: string,
        cartItems: CartItemDto[]
    ): Promise<ICouponValidationResult> {
        const now = new Date();

        // Check if coupon is active
        if (coupon.status !== CouponStatus.ACTIVE) {
            return { valid: false, message: COUPONS_ERROR_MESSAGES.COUPON_NOT_ACTIVE };
        }

        // Check date validity
        if (now < coupon.startDate) {
            return { valid: false, message: COUPONS_ERROR_MESSAGES.COUPON_NOT_YET_VALID };
        }

        if (now > coupon.expiryDate) {
            return { valid: false, message: COUPONS_ERROR_MESSAGES.COUPON_EXPIRED };
        }

        // Check usage limits
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return { valid: false, message: COUPONS_ERROR_MESSAGES.USAGE_LIMIT_EXCEEDED };
        }

        // Check per-user usage limit
        if (coupon.usageLimitPerUser) {
            const userUsageCount = await this.couponUsageModel.countDocuments({
                couponID: coupon._id,
                userID,
            });

            if (userUsageCount >= coupon.usageLimitPerUser) {
                return {
                    valid: false,
                    message: COUPONS_ERROR_MESSAGES.USER_USAGE_LIMIT_EXCEEDED,
                };
            }
        }

        // Check minimum order amount
        const orderTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        if (coupon.minimumOrderAmount && orderTotal < coupon.minimumOrderAmount) {
            return {
                valid: false,
                message: `${COUPONS_ERROR_MESSAGES.MINIMUM_ORDER_NOT_MET}: $${coupon.minimumOrderAmount}`,
            };
        }

        // Check product/category applicability using Set for O(1) lookup
        if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
            const applicableProductIds = new Set(coupon.applicableProducts.map((id) => String(id)));
            const applicableCategoryIds = new Set(
                coupon.applicableCategories.map((id) => String(id))
            );

            const hasApplicableItems = cartItems.some(
                (item) =>
                    applicableProductIds.has(item.productID) ||
                    applicableCategoryIds.has(item.categoryID)
            );

            if (!hasApplicableItems) {
                return {
                    valid: false,
                    message: COUPONS_ERROR_MESSAGES.NOT_APPLICABLE_TO_CART,
                };
            }
        }

        // Check excluded products/categories using Set for O(1) lookup
        if (coupon.excludedProducts.length > 0 || coupon.excludedCategories.length > 0) {
            const excludedProductIds = new Set(coupon.excludedProducts.map((id) => String(id)));
            const excludedCategoryIds = new Set(coupon.excludedCategories.map((id) => String(id)));

            const hasExcludedItems = cartItems.some(
                (item) =>
                    excludedProductIds.has(item.productID) ||
                    excludedCategoryIds.has(item.categoryID)
            );

            if (hasExcludedItems) {
                return {
                    valid: false,
                    message: COUPONS_ERROR_MESSAGES.EXCLUDED_ITEMS_IN_CART,
                };
            }
        }

        return { valid: true };
    }

    private calculateDiscount(
        coupon: CouponDocument,
        cartItems: CartItemDto[],
        orderTotal: number
    ): number {
        let discountAmount = 0;

        switch (coupon.type) {
            case CouponType.PERCENTAGE:
                discountAmount = (orderTotal * coupon.value) / 100;
                if (coupon.maximumDiscountAmount) {
                    discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
                }
                break;

            case CouponType.FIXED_AMOUNT:
                discountAmount = Math.min(coupon.value, orderTotal);
                break;

            case CouponType.FREE_SHIPPING:
                // This would typically be handled in shipping calculation
                // For now, we'll return 0 as shipping discount is calculated separately
                discountAmount = 0;
                break;

            default:
                discountAmount = 0;
        }

        return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
    }

    async getCouponUsageStats(couponID: string): Promise<ICouponUsageStatsResponse> {
        const [coupon, usageStats] = await Promise.all([
            this.couponModel.findById(couponID).exec(),
            this.couponUsageModel.aggregate<ICouponUsageStats>([
                { $match: { couponID: new Types.ObjectId(couponID) } },
                {
                    $group: {
                        _id: null,
                        totalUsage: { $sum: 1 },
                        totalDiscountGiven: { $sum: '$discountAmount' },
                        averageDiscount: { $avg: '$discountAmount' },
                        uniqueUsers: { $addToSet: '$userID' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalUsage: 1,
                        totalDiscountGiven: 1,
                        averageDiscount: 1,
                        uniqueUsersCount: { $size: '$uniqueUsers' },
                    },
                },
            ]),
        ]);

        if (!coupon) {
            throw new NotFoundException(COUPONS_ERROR_MESSAGES.COUPON_NOT_FOUND);
        }

        const defaultStats: ICouponUsageStats = {
            totalUsage: 0,
            totalDiscountGiven: 0,
            averageDiscount: 0,
            uniqueUsersCount: 0,
        };

        return {
            coupon,
            stats: usageStats[0] ?? defaultStats,
        };
    }
}
