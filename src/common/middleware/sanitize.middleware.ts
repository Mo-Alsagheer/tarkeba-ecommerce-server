import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

type SanitizableValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | SanitizableObject
    | SanitizableArray;
type SanitizableObject = { [key: string]: SanitizableValue };
type SanitizableArray = SanitizableValue[];

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Sanitize user input to prevent XSS and NoSQL injection
        if (req.body && typeof req.body === 'object') {
            req.body = this.sanitize(req.body as SanitizableValue);
        }
        // For query and params, sanitize in place since they're read-only
        if (req.query && typeof req.query === 'object') {
            this.sanitizeInPlace(req.query);
        }
        if (req.params && typeof req.params === 'object') {
            this.sanitizeInPlace(req.params);
        }
        next();
    }

    private sanitizeInPlace(obj: Record<string, unknown>): void {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Block NoSQL injection keys
                if (key.startsWith('$') || key.includes('.')) {
                    console.warn(`[Security] NoSQL injection attempt detected: key "${key}"`);
                    delete obj[key];
                    continue;
                }

                const value = obj[key];
                if (typeof value === 'string') {
                    obj[key] = this.sanitizeString(value);
                } else if (Array.isArray(value)) {
                    obj[key] = value.map((item: unknown) =>
                        typeof item === 'string' ? this.sanitizeString(item) : item
                    );
                } else if (value && typeof value === 'object') {
                    this.sanitizeInPlace(value as Record<string, unknown>);
                }
            }
        }
    }

    private sanitizeString(str: string): string {
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*>/gi, '');
    }

    private sanitize(obj: SanitizableValue): SanitizableValue {
        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitize(item));
        }
        if (obj && typeof obj === 'object') {
            const sanitized: SanitizableObject = {};
            const objectToSanitize = obj;
            for (const key in objectToSanitize) {
                // Prevent NoSQL injection by blocking keys starting with $ or containing .
                if (key.startsWith('$') || key.includes('.')) {
                    console.warn(`[Security] NoSQL injection attempt detected: key "${key}"`);
                    continue; // Skip this dangerous key
                }
                if (Object.prototype.hasOwnProperty.call(objectToSanitize, key)) {
                    sanitized[key] = this.sanitize(objectToSanitize[key]);
                }
            }
            return sanitized;
        }
        return obj;
    }
}
