import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get port(): number | undefined {
        return this.configService.get<number>('app.port');
    }

    get frontendUrl(): string | undefined {
        return this.configService.get<string>('app.frontendUrl');
    }

    get nodeEnv(): string | undefined {
        return this.configService.get<string>('app.nodeEnv');
    }
}
