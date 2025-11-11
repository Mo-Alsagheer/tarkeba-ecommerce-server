export interface ReturnStatusBreakdown {
    status: string;
    count: number;
    totalRefundAmount: number;
}

export interface ReturnStatsSummary {
    statusBreakdown: ReturnStatusBreakdown[];
    totalReturns: number;
    totalRefundValue: number;
}
