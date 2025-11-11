import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { MailModule } from './mail/mail.module';

/**
 * MessagingModule - Asynchronous communication infrastructure
 *
 * This module groups messaging-related functionality:
 * - Queue (BullMQ job processing, email queues)
 * - Mail (Nodemailer email sending, templates)
 */
@Module({
    imports: [QueueModule, MailModule],
    exports: [QueueModule, MailModule],
})
export class MessagingModule {}
