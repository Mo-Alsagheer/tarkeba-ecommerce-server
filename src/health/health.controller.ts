import { Controller, Get } from '@nestjs/common';
import * as net from 'net';
import type { HealthCheckResponse } from '../common/types/api.types';

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

    @Get('smtp')
    checkSmtp(): Promise<object> {
        const host = process.env.MAIL_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.MAIL_PORT || '587', 10);
        const timeout = 8000;

        return new Promise((resolve) => {
            const socket = new net.Socket();
            const start = Date.now();

            socket.setTimeout(timeout);

            socket.connect(port, host, () => {
                const ms = Date.now() - start;
                socket.destroy();
                resolve({
                    reachable: true,
                    host,
                    port,
                    latencyMs: ms,
                    message: `Successfully connected to ${host}:${port}`,
                });
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve({
                    reachable: false,
                    host,
                    port,
                    error: 'ETIMEDOUT',
                    message: `Connection to ${host}:${port} timed out after ${timeout}ms — outbound port is likely blocked by Railway.`,
                });
            });

            socket.on('error', (err: NodeJS.ErrnoException) => {
                socket.destroy();
                resolve({
                    reachable: false,
                    host,
                    port,
                    error: err.code || err.message,
                    message: `Failed to connect to ${host}:${port} — ${err.message}`,
                });
            });
        });
    }
}
