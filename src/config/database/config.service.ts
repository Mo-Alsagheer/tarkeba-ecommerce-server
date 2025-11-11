import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
    constructor(private configService: ConfigService) {}

    get uri(): string | undefined {
        return this.configService.get<string>('database.uri');
    }
}
