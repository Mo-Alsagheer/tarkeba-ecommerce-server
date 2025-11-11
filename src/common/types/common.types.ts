import { Types } from 'mongoose';

export type ObjectId = Types.ObjectId;

export type PaginationQuery = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type SearchQuery = {
    search?: string;
    filters?: Record<string, any>;
} & PaginationQuery;

export type DateRange = {
    startDate?: Date;
    endDate?: Date;
};

export type SortOptions = {
    [key: string]: 1 | -1;
};

export type MongoQuery = {
    [key: string]: any;
};

export type UpdateResult = {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId?: ObjectId;
    upsertedCount: number;
    matchedCount: number;
};

export type DeleteResult = {
    acknowledged: boolean;
    deletedCount: number;
};

export type BulkWriteResult = {
    acknowledged: boolean;
    insertedCount: number;
    insertedIds: { [key: number]: ObjectId };
    matchedCount: number;
    modifiedCount: number;
    deletedCount: number;
    upsertedCount: number;
    upsertedIds: { [key: number]: ObjectId };
};
