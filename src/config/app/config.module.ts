import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import configuration from './configuration';

@Module({
    imports: [ConfigModule.forFeature(configuration)],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule {}
