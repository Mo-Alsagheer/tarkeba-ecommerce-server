import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../config/queue.config';
import { WelcomeEmailJobData } from '../../../../common/types';
import { MailService } from '../../mail/mail.service';
import { MESSAGES } from '../../../../common/constants';

@Processor(QUEUE_NAMES.WELCOME_EMAIL)
export class WelcomeEmailProcessor extends WorkerHost {
    private readonly logger = new Logger(WelcomeEmailProcessor.name);

    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<WelcomeEmailJobData>): Promise<void> {
        const { to, username } = job.data;

        this.logger.log(MESSAGES.LOGGER.PROCESSING_WELCOME_EMAIL_JOB, to);

        try {
            await this.mailService.sendWelcomeEmail(to, username);
            this.logger.log(MESSAGES.LOGGER.WELCOME_EMAIL_SENT_SUCCESSFULLY, to);
        } catch (error) {
            this.logger.error(MESSAGES.LOGGER.FAILED_TO_SEND_WELCOME_EMAIL, error);
            throw error;
        }
    }
}
