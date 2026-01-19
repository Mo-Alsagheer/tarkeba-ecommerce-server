import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export interface IUploadOptions {
    folder?: string;
    allowedMimeTypes?: string[];
    maxFileSize?: number;
    transformation?: any;
}

export interface IUploadResult {
    url: string;
    publicId: string;
    format: string;
    width?: number;
    height?: number;
    size: number;
}

@Injectable()
export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);
    private readonly storageProvider: string;
    private readonly allowedMimeTypes: string[];
    private readonly maxFileSize: number;

    constructor(private configService: ConfigService) {
        this.storageProvider = this.configService.get<string>('storage.provider') || 'local';
        this.allowedMimeTypes =
            this.configService.get<string[]>('storage.local.allowedMimeTypes') || [];
        this.maxFileSize = this.configService.get<number>('storage.local.maxFileSize') || 5242880;

        // Configure Cloudinary if it's the selected provider
        if (this.storageProvider === 'cloudinary') {
            const cloudName = this.configService.get<string>('storage.cloudinary.cloudName');
            const apiKey = this.configService.get<string>('storage.cloudinary.apiKey');
            const apiSecret = this.configService.get<string>('storage.cloudinary.apiSecret');

            if (!cloudName || !apiKey || !apiSecret) {
                this.logger.warn(
                    'Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file'
                );
            } else {
                cloudinary.config({
                    cloud_name: cloudName,
                    api_key: apiKey,
                    api_secret: apiSecret,
                });
                this.logger.log('Cloudinary configured successfully');
            }
        }
    }

    /**
     * Upload a single file
     */
    async uploadSingle(
        file: Express.Multer.File,
        options?: IUploadOptions
    ): Promise<IUploadResult> {
        // Validate file
        this.validateFile(file, options);

        try {
            switch (this.storageProvider) {
                case 'cloudinary':
                    return await this.uploadToCloudinary(file, options);
                case 'local':
                    return await this.uploadToLocal(file, options);
                case 's3':
                    throw new BadRequestException('S3 upload not implemented yet');
                default:
                    throw new BadRequestException(
                        `Unsupported storage provider: ${this.storageProvider}`
                    );
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`File upload failed: ${errorMsg}`, errorStack);
            throw new BadRequestException(`File upload failed: ${errorMsg}`);
        }
    }

    /**
     * Upload multiple files
     */
    async uploadMultiple(
        files: Express.Multer.File[],
        options?: IUploadOptions
    ): Promise<IUploadResult[]> {
        const uploadPromises = files.map((file) => this.uploadSingle(file, options));
        return await Promise.all(uploadPromises);
    }

    /**
     * Delete a file from storage
     */
    async deleteFile(publicId: string): Promise<void> {
        try {
            switch (this.storageProvider) {
                case 'cloudinary':
                    await cloudinary.uploader.destroy(publicId);
                    this.logger.log(`File deleted from Cloudinary: ${publicId}`);
                    break;
                case 'local': {
                    const uploadPath =
                        this.configService.get<string>('storage.local.uploadPath') || './uploads';
                    const filePath = path.join(process.cwd(), uploadPath, publicId);
                    if (fs.existsSync(filePath)) {
                        await unlinkAsync(filePath);
                        this.logger.log(`File deleted from local storage: ${publicId}`);
                    }
                    break;
                }
                case 's3':
                    throw new BadRequestException('S3 delete not implemented yet');
                default:
                    throw new BadRequestException(
                        `Unsupported storage provider: ${this.storageProvider}`
                    );
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`File deletion failed: ${errorMsg}`, errorStack);
            throw new BadRequestException(`File deletion failed: ${errorMsg}`);
        }
    }

    /**
     * Validate uploaded file
     */
    private validateFile(file: Express.Multer.File, options?: IUploadOptions): void {
        // Check file size
        const maxSize = options?.maxFileSize || this.maxFileSize;
        if (file.size > maxSize) {
            throw new BadRequestException(
                `File size exceeds maximum allowed size of ${maxSize} bytes`
            );
        }

        // Check MIME type
        const allowedTypes = options?.allowedMimeTypes || this.allowedMimeTypes;
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
            );
        }
    }

    /**
     * Upload file to Cloudinary
     */
    private async uploadToCloudinary(
        file: Express.Multer.File,
        options?: IUploadOptions
    ): Promise<IUploadResult> {
        return new Promise((resolve, reject) => {
            const uploadOptions: Record<string, unknown> = {
                folder: options?.folder || 'tarkeba',
                resource_type: 'auto',
                use_filename: true,
                unique_filename: true,
            };

            // Add transformation if provided
            if (options?.transformation) {
                uploadOptions.transformation = options.transformation;
            }

            cloudinary.uploader
                .upload_stream(
                    uploadOptions,
                    (
                        error: UploadApiErrorResponse | undefined,
                        result: UploadApiResponse | undefined
                    ) => {
                        if (error) {
                            this.logger.error(`Cloudinary upload error: ${error.message}`);
                            reject(new Error(error.message));
                            return;
                        }

                        if (!result) {
                            reject(new Error('Upload failed: No result returned'));
                            return;
                        }

                        const uploadResult: IUploadResult = {
                            url: result.secure_url,
                            publicId: result.public_id,
                            format: result.format,
                            width: result.width,
                            height: result.height,
                            size: result.bytes,
                        };

                        this.logger.log(`File uploaded to Cloudinary: ${result.public_id}`);
                        resolve(uploadResult);
                    }
                )
                .end(file.buffer);
        });
    }

    /**
     * Upload file to local storage
     */
    private async uploadToLocal(
        file: Express.Multer.File,
        options?: IUploadOptions
    ): Promise<IUploadResult> {
        const uploadPath =
            this.configService.get<string>('storage.local.uploadPath') || './uploads';
        const folder = options?.folder || 'default';
        const fullPath = path.join(process.cwd(), uploadPath, folder);

        // Create directory if it doesn't exist
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(fullPath, filename);

        // Write file to disk
        await promisify(fs.writeFile)(filePath, file.buffer);

        const uploadResult: IUploadResult = {
            url: `/uploads/${folder}/${filename}`,
            publicId: `${folder}/${filename}`,
            format: path.extname(filename).slice(1),
            size: file.size,
        };

        this.logger.log(`File uploaded to local storage: ${uploadResult.publicId}`);
        return uploadResult;
    }
}
