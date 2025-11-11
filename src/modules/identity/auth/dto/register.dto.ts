import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    IsString,
    Matches,
    MaxLength,
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    API_DESCRIPTIONS,
    API_EXAMPLES,
    AUTH_VALIDATION_MESSAGES,
    AUTH_FIELD_CONSTRAINTS,
} from '../../../../common/constants';

// Custom validator to match password confirmation
export function Match(property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const relatedPropertyName = args.constraints[0] as string;
                    const relatedValue = (args.object as Record<string, unknown>)[
                        relatedPropertyName
                    ];
                    return (
                        typeof value === 'string' &&
                        typeof relatedValue === 'string' &&
                        value === relatedValue
                    );
                },
            },
        });
    };
}

export class RegisterDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.USERNAME,
        example: API_EXAMPLES.AUTH.USERNAME,
        minLength: AUTH_FIELD_CONSTRAINTS.USERNAME.MIN_LENGTH,
        maxLength: AUTH_FIELD_CONSTRAINTS.USERNAME.MAX_LENGTH,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.USERNAME_REQUIRED })
    @IsString()
    @MinLength(AUTH_FIELD_CONSTRAINTS.USERNAME.MIN_LENGTH, {
        message: AUTH_VALIDATION_MESSAGES.USERNAME_MIN_LENGTH,
    })
    @MaxLength(AUTH_FIELD_CONSTRAINTS.USERNAME.MAX_LENGTH, {
        message: AUTH_VALIDATION_MESSAGES.USERNAME_MAX_LENGTH,
    })
    username: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.EMAIL,
        example: API_EXAMPLES.AUTH.EMAIL,
        format: AUTH_FIELD_CONSTRAINTS.EMAIL.FORMAT,
    })
    @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_INVALID })
    email: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.NEW_PASSWORD,
        example: API_EXAMPLES.AUTH.PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
        maxLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MAX_LENGTH,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    @MinLength(AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH, {
        message: AUTH_VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
    })
    @Matches(AUTH_FIELD_CONSTRAINTS.PASSWORD.PATTERN, {
        message: AUTH_VALIDATION_MESSAGES.PASSWORD_COMPLEXITY,
    })
    password: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.CONFIRM_PASSWORD,
        example: API_EXAMPLES.AUTH.PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
        maxLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MAX_LENGTH,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED })
    @IsString()
    @Match('password', {
        message: AUTH_VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    })
    confirmPassword: string;
}
