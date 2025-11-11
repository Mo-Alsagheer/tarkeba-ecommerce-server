export interface ReviewRatingDistribution {
    [key: number]: number;
}

export interface ReviewStatsSummary {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: ReviewRatingDistribution;
}
