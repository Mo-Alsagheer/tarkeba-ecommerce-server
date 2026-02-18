import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { EMAIL_SUBJECTS, MESSAGES } from '../../../common/constants';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private resend: Resend;
    private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
    private readonly fromAddress: string;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            this.logger.error('RESEND_API_KEY is not set — mail service will not work.');
        }
        this.resend = new Resend(apiKey);
        this.fromAddress = `"${process.env.MAIL_FROM_NAME || 'Tarkeba E-Commerce'}" <${process.env.MAIL_FROM || 'onboarding@resend.dev'}>`;
        this.loadTemplates();
        this.logger.log('Mail service initialized using Resend (HTTPS API).');
    }

    private loadTemplates() {
        const templateDir = path.join(__dirname, 'templates');
        const templateFiles = ['welcome', 'verification', 'password-reset', 'order-status'];

        templateFiles.forEach((templateName) => {
            try {
                const templatePath = path.join(templateDir, `${templateName}.hbs`);
                if (fs.existsSync(templatePath)) {
                    const templateContent = fs.readFileSync(templatePath, 'utf-8');
                    const compiledTemplate = handlebars.compile(templateContent);
                    this.templates.set(templateName, compiledTemplate);
                } else {
                    this.logger.warn(`Template file not found: ${templatePath}`);
                }
            } catch (error) {
                this.logger.error(`Failed to load template: ${templateName}`, error);
            }
        });

        this.logger.log(`Loaded ${this.templates.size} email templates.`);
    }

    private renderTemplate(templateName: string, context: any): string {
        const template = this.templates.get(templateName);
        if (!template) {
            throw new Error(`Template not found: ${templateName}`);
        }
        return template(context);
    }

    async sendEmail(options: {
        to: string;
        subject: string;
        template: string;
        context: any;
    }): Promise<void> {
        const html = this.renderTemplate(options.template, options.context);

        try {
            const { data, error } = await this.resend.emails.send({
                from: this.fromAddress,
                to: options.to,
                subject: options.subject,
                html,
            });

            if (error) {
                this.logger.error(MESSAGES.LOGGER.FAILED_TO_SEND_EMAIL, options.to, error);
                throw new Error(error.message);
            }

            this.logger.log(MESSAGES.LOGGER.EMAIL_SENT_SUCCESSFULLY, options.to, data?.id);
        } catch (error: unknown) {
            this.logger.error(MESSAGES.LOGGER.FAILED_TO_SEND_EMAIL, options.to, error);
            throw error;
        }
    }

    async sendWelcomeEmail(to: string, username: string): Promise<void> {
        await this.sendEmail({
            to,
            subject: EMAIL_SUBJECTS.WELCOME,
            template: 'welcome',
            context: {
                username,
                currentYear: new Date().getFullYear(),
                companyName: 'Tarkeba',
            },
        });
    }

    async sendVerificationEmail(
        to: string,
        username: string,
        otpCode: string,
        expiresInMinutes: number
    ): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'Verify Your Email - Tarkeba',
            template: 'verification',
            context: {
                username,
                otpCode,
                expiresInMinutes,
                currentYear: new Date().getFullYear(),
                companyName: 'Tarkeba',
            },
        });
    }

    async sendPasswordResetEmail(
        to: string,
        username: string,
        otpCode: string,
        expiresInMinutes: number
    ): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'Password Reset Request - Tarkeba',
            template: 'password-reset',
            context: {
                username,
                otpCode,
                expiresInMinutes,
                currentYear: new Date().getFullYear(),
                companyName: 'Tarkeba',
            },
        });
    }

    async sendOrderStatusEmail(
        to: string,
        orderData: {
            username: string;
            orderNumber: string;
            status: string;
            trackingNumber?: string;
            trackingUrl?: string;
        }
    ): Promise<void> {
        await this.sendEmail({
            to,
            subject: `Order ${orderData.orderNumber} - ${orderData.status}`,
            template: 'order-status',
            context: {
                ...orderData,
                currentYear: new Date().getFullYear(),
                companyName: 'Tarkeba',
            },
        });
    }
}
