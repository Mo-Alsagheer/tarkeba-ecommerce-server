import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../config/queue.config';
import { VerificationEmailJobData } from '../../../../common/types/email-job.types';
import { MailService } from '../../mail/mail.service';

@Processor(QUEUE_NAMES.VERIFICATION_EMAIL)
export class VerificationEmailProcessor extends WorkerHost {
    private readonly logger = new Logger(VerificationEmailProcessor.name);

    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<VerificationEmailJobData>): Promise<void> {
        const { to, username, otpCode, expiresInMinutes } = job.data;

        this.logger.log(`Processing verification email job for: ${to}`);

        try {
            await this.mailService.sendVerificationEmail(to, username, otpCode, expiresInMinutes);
            this.logger.log(`Verification email sent successfully to: ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send verification email to: ${to}`, error);
            throw error;
        }
    }
}
