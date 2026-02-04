import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponse } from '../common/types/api.types';

@Controller('health')
export class HealthController {
    @Get()
    getHealth(): HealthCheckResponse {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || 'unknown',
            services: {
                api: { status: 'up' },
            },
        };
    }
}
