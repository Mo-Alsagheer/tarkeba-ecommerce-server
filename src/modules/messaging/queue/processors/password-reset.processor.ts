import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../config/queue.config';
import { PasswordResetEmailJobData } from '../../../../common/types/email-job.types';
import { MailService } from '../../mail/mail.service';

@Processor(QUEUE_NAMES.PASSWORD_RESET)
export class PasswordResetEmailProcessor extends WorkerHost {
    private readonly logger = new Logger(PasswordResetEmailProcessor.name);

    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<PasswordResetEmailJobData>): Promise<void> {
        const { to, username, otpCode, expiresInMinutes } = job.data;

        this.logger.log(`Processing password reset email job for: ${to}`);

        try {
            await this.mailService.sendPasswordResetEmail(to, username, otpCode, expiresInMinutes);
            this.logger.log(`Password reset email sent successfully to: ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send password reset email to: ${to}`, error);
            throw error;
        }
    }
}
