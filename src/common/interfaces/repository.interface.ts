import { ObjectId, PaginatedResponse, PaginationQuery } from '../types';

export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string | ObjectId): Promise<T | null>;
    findOne(query: any): Promise<T | null>;
    findMany(query: any, options?: IQueryOptions): Promise<T[]>;
    findAll(query?: PaginationQuery): Promise<PaginatedResponse<T>>;
    update(id: string | ObjectId, data: Partial<T>): Promise<T | null>;
    updateMany(query: any, data: Partial<T>): Promise<{ modifiedCount: number }>;
    delete(id: string | ObjectId): Promise<boolean>;
    deleteMany(query: any): Promise<{ deletedCount: number }>;
    count(query?: any): Promise<number>;
    exists(query: any): Promise<boolean>;
    aggregate(pipeline: any[]): Promise<any[]>;
    bulkWrite(operations: any[]): Promise<any>;
}

export interface IQueryOptions {
    select?: string | string[];
    populate?: string | IPopulateOptions | Array<string | IPopulateOptions>;
    sort?: string | { [key: string]: 1 | -1 };
    limit?: number;
    skip?: number;
    lean?: boolean;
    projection?: any;
}

export interface IPopulateOptions {
    path: string;
    select?: string;
    model?: string;
    match?: any;
    populate?: IPopulateOptions | IPopulateOptions[];
    options?: any;
}

export interface ITransactionOptions {
    session?: any;
    new?: boolean;
    upsert?: boolean;
    runValidators?: boolean;
}

export interface ISoftDeleteRepository<T> extends IBaseRepository<T> {
    softDelete(id: string | ObjectId): Promise<boolean>;
    restore(id: string | ObjectId): Promise<boolean>;
    findWithDeleted(query: any, options?: IQueryOptions): Promise<T[]>;
    findDeleted(query: any, options?: IQueryOptions): Promise<T[]>;
    forceDelete(id: string | ObjectId): Promise<boolean>;
}

export interface IAuditableRepository<T> extends IBaseRepository<T> {
    createWithAudit(data: Partial<T>, userId: ObjectId): Promise<T>;
    updateWithAudit(id: string | ObjectId, data: Partial<T>, userId: ObjectId): Promise<T | null>;
    deleteWithAudit(id: string | ObjectId, userId: ObjectId): Promise<boolean>;
    getAuditHistory(id: string | ObjectId): Promise<any[]>;
}

export interface ISearchableRepository<T> extends IBaseRepository<T> {
    search(searchTerm: string, options?: ISearchOptions): Promise<PaginatedResponse<T>>;
    createTextIndex(fields: { [key: string]: string }): Promise<void>;
    searchWithFilters(
        searchTerm: string,
        filters: any,
        options?: ISearchOptions
    ): Promise<PaginatedResponse<T>>;
}

export interface ISearchOptions extends IQueryOptions {
    fuzzy?: boolean;
    caseSensitive?: boolean;
    diacriticSensitive?: boolean;
    language?: string;
    score?: boolean;
}

export interface ICacheableRepository<T> extends IBaseRepository<T> {
    findByIdWithCache(id: string | ObjectId, ttl?: number): Promise<T | null>;
    invalidateCache(key: string): Promise<void>;
    invalidateAllCache(): Promise<void>;
    setCacheKey(id: string | ObjectId): string;
}
