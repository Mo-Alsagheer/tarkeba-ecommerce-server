import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../config/queue.config';
import { OrderStatusEmailJobData } from '../../../../common/types/email-job.types';
import { MailService } from '../../mail/mail.service';

@Processor(QUEUE_NAMES.ORDER_STATUS)
export class OrderStatusEmailProcessor extends WorkerHost {
    private readonly logger = new Logger(OrderStatusEmailProcessor.name);

    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<OrderStatusEmailJobData>): Promise<void> {
        const { to, username, orderNumber, status, trackingNumber, trackingUrl } = job.data;

        this.logger.log(`Processing order status email job for: ${to} (Order: ${orderNumber})`);

        try {
            await this.mailService.sendOrderStatusEmail(to, {
                username,
                orderNumber,
                status,
                trackingNumber,
                trackingUrl,
            });
            this.logger.log(`Order status email sent successfully to: ${to} (Status: ${status})`);
        } catch (error) {
            this.logger.error(`Failed to send order status email to: ${to}`, error);
            throw error;
        }
    }
}
