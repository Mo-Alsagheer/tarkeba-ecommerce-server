import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES, getRedisConfig } from '../../../config/queue.config';
import { EmailProducerService } from './producers/email-producer.service';
import { WelcomeEmailProcessor } from './processors/welcome.processor';
import { VerificationEmailProcessor } from './processors/verification.processor';
import { PasswordResetEmailProcessor } from './processors/password-reset.processor';
import { OrderStatusEmailProcessor } from './processors/order-status.processor';
import { MailService } from '../mail/mail.service';

@Module({
    imports: [
        // Register BullMQ module with Redis connection
        BullModule.forRoot({
            connection: getRedisConfig(),
        }),
        // Register all email queues
        BullModule.registerQueue(
            { name: QUEUE_NAMES.WELCOME_EMAIL },
            { name: QUEUE_NAMES.VERIFICATION_EMAIL },
            { name: QUEUE_NAMES.PASSWORD_RESET },
            { name: QUEUE_NAMES.ORDER_STATUS }
        ),
    ],
    providers: [
        // Producer service for adding jobs to queues
        EmailProducerService,
        // Processors (workers) for consuming jobs
        WelcomeEmailProcessor,
        VerificationEmailProcessor,
        PasswordResetEmailProcessor,
        OrderStatusEmailProcessor,
        // Mail service for sending emails
        MailService,
    ],
    exports: [EmailProducerService], // Export for use in other modules
})
export class QueueModule {}
