import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { getMailConfig } from '../../../config/mail.config';
import { EMAIL_SUBJECTS, MESSAGES } from '../../../common/constants';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;
    private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

    constructor() {
        this.initializeTransporter();
        this.loadTemplates();
    }

    private initializeTransporter() {
        const mailConfig = getMailConfig();
        const transportOptions: SMTPTransport.Options = {
            host: mailConfig.host,
            port: mailConfig.port,
            secure: mailConfig.secure,
            auth: mailConfig.auth,
        };
        this.transporter = nodemailer.createTransport(transportOptions);

        // Verify connection
        this.transporter.verify((error) => {
            if (error) {
                this.logger.error(MESSAGES.LOGGER.FAILED_TO_CONNECT_TO_SMTP_SERVER, error);
            } else {
                this.logger.log(MESSAGES.LOGGER.SMTP_SERVER_CONNECTION_ESTABLISHED);
            }
        });
    }

    private loadTemplates() {
        const templateDir = path.join(__dirname, 'templates');
        console.log(`[MailService] Template directory: ${templateDir}`);
        console.log(`[MailService] Directory exists: ${fs.existsSync(templateDir)}`);

        const templateFiles = ['welcome', 'verification', 'password-reset', 'order-status'];

        templateFiles.forEach((templateName) => {
            try {
                const templatePath = path.join(templateDir, `${templateName}.hbs`);
                console.log(`[MailService] Checking template path: ${templatePath}`);
                if (fs.existsSync(templatePath)) {
                    const templateContent = fs.readFileSync(templatePath, 'utf-8');
                    const compiledTemplate = handlebars.compile(templateContent);
                    this.templates.set(templateName, compiledTemplate);
                    console.log(`[MailService] Loaded template: ${templateName}`);
                } else {
                    console.warn(`[MailService] Template file not found: ${templatePath}`);
                }
            } catch (error) {
                console.error(`[MailService] Failed to load template: ${templateName}`, error);
            }
        });

        console.log(`[MailService] Total templates loaded: ${this.templates.size}`);
    }

    private renderTemplate(templateName: string, context: any): string {
        const template = this.templates.get(templateName);
        console.log(template);
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
        const mailConfig = getMailConfig();
        const html = this.renderTemplate(options.template, options.context);

        const mailOptions = {
            from: `"${mailConfig.from.name}" <${mailConfig.from.address}>`,
            to: options.to,
            subject: options.subject,
            html,
        };

        try {
            const info: SMTPTransport.SentMessageInfo =
                await this.transporter.sendMail(mailOptions);
            this.logger.log(MESSAGES.LOGGER.EMAIL_SENT_SUCCESSFULLY, options.to, info.messageId);
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
