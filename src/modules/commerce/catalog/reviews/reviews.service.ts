import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Review, ReviewDocument, ReviewStatus } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { SortOrder } from '../../../../common/enums';
import { ReviewStatsSummary } from '../../../../common/interfaces';
import { OrdersService } from '../../../commerce/sales/orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name)
        private reviewModel: Model<ReviewDocument>,
        private ordersService: OrdersService,
        private productsService: ProductsService
    ) {}

    async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
        // Check if user already reviewed this product for this order
        const existingReview = await this.reviewModel.findOne({
            productId: createReviewDto.productId,
            userId: new Types.ObjectId(userId),
            orderId: createReviewDto.orderId,
        });

        if (existingReview) {
            throw new BadRequestException('You have already reviewed this product for this order');
        }

        // Verify that the user actually purchased this product in this order
        const order = await this.ordersService.findOne(createReviewDto.orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        if (order.userID.toString() !== userId) {
            throw new ForbiddenException('You can only review products you have purchased');
        }

        const product = await this.productsService.findOne(createReviewDto.productId);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const review = new this.reviewModel({
            ...createReviewDto,
            userId: new Types.ObjectId(userId),
            productId: new Types.ObjectId(createReviewDto.productId),
            orderId: new Types.ObjectId(createReviewDto.orderId),
        });

        return review.save();
    }

    async findAll(queryDto: QueryReviewsDto) {
        const {
            page = 1,
            limit = 10,
            productId,
            userId,
            status,
            rating,
            sortBy = 'createdAt',
            sortOrder = SortOrder.DESC,
        } = queryDto;

        const filter: FilterQuery<ReviewDocument> = {};

        if (productId) {
            filter.productId = new Types.ObjectId(productId);
        }

        if (userId) {
            filter.userId = new Types.ObjectId(userId);
        }

        if (status) {
            filter.status = status;
        }

        if (rating) {
            filter.rating = rating;
        }

        const sortOptions: Record<string, 1 | -1> = {};
        sortOptions[sortBy] = sortOrder === SortOrder.ASC ? 1 : -1;

        const skip = (Number(page) - 1) * Number(limit);

        const [reviews, total] = await Promise.all([
            this.reviewModel
                .find(filter)
                .populate('userId', 'username email')
                .populate('productId', 'name images')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.reviewModel.countDocuments(filter),
        ]);

        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewModel
            .findById(id)
            .populate('userId', 'username email')
            .populate('productId', 'name images')
            .exec();

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }

    async update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review> {
        const review = await this.reviewModel.findById(id);

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        // Only allow the review author to update their own review
        if (review.userId.toString() !== userId) {
            throw new ForbiddenException('You can only update your own reviews');
        }

        // Only allow updates if review is pending or approved
        if (review.status === ReviewStatus.REJECTED) {
            throw new BadRequestException('Cannot update a rejected review');
        }

        // Reset status to pending if review is being updated
        const updatedReview = await this.reviewModel
            .findByIdAndUpdate(
                id,
                {
                    ...updateReviewDto,
                    status: ReviewStatus.PENDING,
                },
                { new: true }
            )
            .populate('userId', 'username email')
            .populate('productId', 'name images')
            .exec();

        return updatedReview!;
    }

    async moderate(id: string, moderateReviewDto: ModerateReviewDto): Promise<Review> {
        const review = await this.reviewModel.findById(id);

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.status !== ReviewStatus.PENDING) {
            throw new BadRequestException('Cannot moderate a non-pending review');
        }

        const updatedReview = await this.reviewModel
            .findByIdAndUpdate(
                id,
                {
                    status: moderateReviewDto.status,
                },
                { new: true }
            )
            .populate('userId', 'username email')
            .populate('productId', 'name images')
            .exec();

        return updatedReview!;
    }

    async remove(id: string, userId: string): Promise<void> {
        const review = await this.reviewModel.findById(id);

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        // Only allow the review author to delete their own review
        if (review.userId.toString() !== userId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.reviewModel.findByIdAndDelete(id);
    }

    async getProductReviewStats(productId: string): Promise<ReviewStatsSummary> {
        const stats = await this.reviewModel.aggregate<ReviewStatsSummary>([
            {
                $match: {
                    productId: new Types.ObjectId(productId),
                    status: ReviewStatus.APPROVED,
                },
            },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    ratingDistribution: {
                        $push: '$rating',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalReviews: 1,
                    averageRating: { $round: ['$averageRating', 2] },
                    ratingDistribution: {
                        1: {
                            $size: {
                                $filter: {
                                    input: '$ratingDistribution',
                                    cond: { $eq: ['$$this', 1] },
                                },
                            },
                        },
                        2: {
                            $size: {
                                $filter: {
                                    input: '$ratingDistribution',
                                    cond: { $eq: ['$$this', 2] },
                                },
                            },
                        },
                        3: {
                            $size: {
                                $filter: {
                                    input: '$ratingDistribution',
                                    cond: { $eq: ['$$this', 3] },
                                },
                            },
                        },
                        4: {
                            $size: {
                                $filter: {
                                    input: '$ratingDistribution',
                                    cond: { $eq: ['$$this', 4] },
                                },
                            },
                        },
                        5: {
                            $size: {
                                $filter: {
                                    input: '$ratingDistribution',
                                    cond: { $eq: ['$$this', 5] },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        return (
            stats[0] || {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            }
        );
    }
}
