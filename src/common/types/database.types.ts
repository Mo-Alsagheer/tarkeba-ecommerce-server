import { Document, Types } from 'mongoose';

export type MongoDocument<T = any> = T & Document;

export type MongoId = Types.ObjectId;

export type TimestampedDocument = {
    createdAt: Date;
    updatedAt: Date;
};

export type SoftDeleteDocument = {
    deletedAt?: Date;
    isDeleted: boolean;
};

export type AuditableDocument = {
    createdBy?: MongoId;
    updatedBy?: MongoId;
    deletedBy?: MongoId;
} & TimestampedDocument &
    SoftDeleteDocument;

export type MongooseOptions = {
    timestamps?: boolean;
    versionKey?: boolean;
    toJSON?: {
        transform?: (doc: any, ret: any) => any;
        virtuals?: boolean;
    };
    toObject?: {
        transform?: (doc: any, ret: any) => any;
        virtuals?: boolean;
    };
};

export type IndexDefinition = {
    fields: Record<string, 1 | -1 | 'text' | '2dsphere'>;
    options?: {
        unique?: boolean;
        sparse?: boolean;
        background?: boolean;
        expireAfterSeconds?: number;
        name?: string;
    };
};

export type AggregationPipeline = Array<Record<string, any>>;

export type PopulateOptions = {
    path: string;
    select?: string;
    model?: string;
    match?: any;
    populate?: PopulateOptions | PopulateOptions[];
};

export type QueryOptions = {
    select?: string;
    populate?: PopulateOptions | PopulateOptions[];
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    lean?: boolean;
};

export type TransactionOptions = {
    readPreference?: string;
    readConcern?: { level: string };
    writeConcern?: { w: number | string; j?: boolean; wtimeout?: number };
};

export type DatabaseConnection = {
    name: string;
    uri: string;
    options?: Record<string, any>;
};
