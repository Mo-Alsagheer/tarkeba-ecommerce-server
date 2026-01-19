import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';
import storageConfig from '../../../config/storage.config';

@Module({
    imports: [ConfigModule.forFeature(storageConfig)],
    providers: [FileUploadService],
    exports: [FileUploadService],
})
export class FileUploadModule {}
