export interface IAppConfig {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    port: number;
    url: string;
    apiPrefix: string;
    corsOrigins: string[];
    rateLimiting: {
        windowMs: number;
        max: number;
    };
    security: {
        bcryptRounds: number;
        jwtSecret: string;
        jwtExpiresIn: string;
        refreshTokenExpiresIn: string;
    };
}

export interface IDatabaseConfig {
    uri: string;
    options: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
        maxPoolSize: number;
        minPoolSize: number;
        maxIdleTimeMS: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        family: number;
        bufferMaxEntries: number;
        bufferCommands: boolean;
    };
}

export interface IEmailConfig {
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
    smtp?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    sendgrid?: {
        apiKey: string;
    };
    mailgun?: {
        apiKey: string;
        domain: string;
    };
    ses?: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
    from: {
        name: string;
        email: string;
    };
    templates: {
        baseUrl: string;
        engine: 'handlebars' | 'ejs' | 'pug';
    };
}

export interface IQueueConfig {
    mongodb: {
        uri: string;
        collection: string;
    };
    defaultJobOptions: {
        priority: number;
        attempts: number;
        backoff: {
            type: 'exponential' | 'fixed';
            delay: number;
        };
    };
    concurrency: number;
    maxConcurrency: number;
}

export interface IOAuthConfig {
    google: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    };
    facebook: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    };
}

export interface IPaymobConfig {
    apiKey: string;
    baseUrl: string;
    integrationIds: {
        visa: number;
        mastercard: number;
        vodafoneCash: number;
        orangeCash: number;
        etisalatCash: number;
        wePay: number;
    };
    iframeId: number;
    hmacSecret: string;
}

export interface IStorageConfig {
    provider: 'local' | 's3' | 'cloudinary';
    local?: {
        uploadPath: string;
        maxFileSize: number;
        allowedMimeTypes: string[];
    };
    s3?: {
        region: string;
        bucket: string;
        accessKeyId: string;
        secretAccessKey: string;
        cloudFrontUrl?: string;
    };
    cloudinary?: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
}

export interface IRedisConfig {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
    retryDelayOnFailover: number;
    maxRetriesPerRequest: number;
}
