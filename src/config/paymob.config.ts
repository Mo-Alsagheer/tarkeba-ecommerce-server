import { registerAs } from '@nestjs/config';

export default registerAs('paymob', () => ({
    apiKey: process.env.PAYMOB_API_KEY,
    integrationId: process.env.PAYMOB_INTEGRATION_ID,
    hmacSecret: process.env.PAYMOB_HMAC_SECRET,
    baseUrl: process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com/api',
    integrationIds: {
        visa: parseInt(process.env.PAYMOB_VISA_INTEGRATION_ID || '0'),
        mastercard: parseInt(process.env.PAYMOB_MASTERCARD_INTEGRATION_ID || '0'),
        vodafoneCash: parseInt(process.env.PAYMOB_VODAFONE_CASH_INTEGRATION_ID || '0'),
        orangeCash: parseInt(process.env.PAYMOB_ORANGE_CASH_INTEGRATION_ID || '0'),
        etisalatCash: parseInt(process.env.PAYMOB_ETISALAT_CASH_INTEGRATION_ID || '0'),
        wePay: parseInt(process.env.PAYMOB_WE_PAY_INTEGRATION_ID || '0'),
    },
    iframeId: parseInt(process.env.PAYMOB_IFRAME_ID || '0'),
}));
