import { registerAs } from '@nestjs/config';
import { IStorageConfig } from '../common/interfaces';

export default registerAs(
    'storage',
    (): IStorageConfig => ({
        provider: (process.env.STORAGE_PROVIDER as 'local' | 's3' | 'cloudinary') || 'local',
        local: {
            uploadPath: process.env.UPLOAD_PATH || './uploads',
            maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
            allowedMimeTypes: [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
                'image/gif',
            ],
        },
        s3: {
            region: process.env.AWS_REGION || '',
            bucket: process.env.AWS_S3_BUCKET || '',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            cloudFrontUrl: process.env.AWS_CLOUDFRONT_URL,
        },
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
            apiKey: process.env.CLOUDINARY_API_KEY || '',
            apiSecret: process.env.CLOUDINARY_API_SECRET || '',
        },
    })
);
