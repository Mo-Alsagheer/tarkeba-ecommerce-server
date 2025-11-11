import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, getQueueOptions, EmailPriority } from '../../../../config/queue.config';
import {
    WelcomeEmailJobData,
    VerificationEmailJobData,
    PasswordResetEmailJobData,
    OrderStatusEmailJobData,
} from '../../../../common/types';

@Injectable()
export class EmailProducerService implements OnModuleInit {
    private readonly logger = new Logger(EmailProducerService.name);
    private queues: Map<string, Queue> = new Map();

    onModuleInit() {
        this.initializeQueues();
    }

    private initializeQueues() {
        Object.values(QUEUE_NAMES).forEach((queueName) => {
            const queue = new Queue(queueName, getQueueOptions(queueName));
            this.queues.set(queueName, queue);
            this.logger.log(`Initialized queue: ${queueName}`);
        });
    }

    async addWelcomeEmailJob(data: WelcomeEmailJobData): Promise<void> {
        const queue = this.queues.get(QUEUE_NAMES.WELCOME_EMAIL);
        if (!queue) {
            throw new Error(`Queue not found: ${QUEUE_NAMES.WELCOME_EMAIL}`);
        }

        await queue.add('send-welcome-email', data, {
            priority: EmailPriority.NORMAL,
        });

        this.logger.log(`Added welcome email job for: ${data.to}`);
    }

    async addVerificationEmailJob(data: VerificationEmailJobData): Promise<void> {
        const queue = this.queues.get(QUEUE_NAMES.VERIFICATION_EMAIL);
        if (!queue) {
            throw new Error(`Queue not found: ${QUEUE_NAMES.VERIFICATION_EMAIL}`);
        }

        await queue.add('send-verification-email', data, {
            priority: EmailPriority.HIGH,
        });

        this.logger.log(`Added verification email job for: ${data.to}`);
    }

    async addPasswordResetEmailJob(data: PasswordResetEmailJobData): Promise<void> {
        const queue = this.queues.get(QUEUE_NAMES.PASSWORD_RESET);
        if (!queue) {
            throw new Error(`Queue not found: ${QUEUE_NAMES.PASSWORD_RESET}`);
        }

        await queue.add('send-password-reset-email', data, {
            priority: EmailPriority.HIGH,
        });

        this.logger.log(`Added password reset email job for: ${data.to}`);
    }

    async addOrderStatusEmailJob(data: OrderStatusEmailJobData): Promise<void> {
        const queue = this.queues.get(QUEUE_NAMES.ORDER_STATUS);
        if (!queue) {
            throw new Error(`Queue not found: ${QUEUE_NAMES.ORDER_STATUS}`);
        }

        const priority = this.getOrderPriority(data.status);
        await queue.add('send-order-status-email', data, {
            priority,
        });

        this.logger.log(`Added order status email job for: ${data.to} (${data.status})`);
    }

    private getOrderPriority(status: string): EmailPriority {
        const highPriorityStatuses = ['confirmed', 'shipped', 'delivered'];
        return highPriorityStatuses.includes(status.toLowerCase())
            ? EmailPriority.HIGH
            : EmailPriority.NORMAL;
    }

    async getQueueStats(queueName: string) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue not found: ${queueName}`);
        }

        const [waiting, active, completed, failed, delayed] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
        ]);

        return {
            queueName,
            waiting,
            active,
            completed,
            failed,
            delayed,
        };
    }

    async getAllQueuesStats() {
        const stats = await Promise.all(
            Array.from(this.queues.keys()).map((queueName) => this.getQueueStats(queueName))
        );
        return stats;
    }

    async onModuleDestroy() {
        // Clean up queues
        await Promise.all(Array.from(this.queues.values()).map((queue) => queue.close()));
        this.logger.log('All queues closed');
    }
}
