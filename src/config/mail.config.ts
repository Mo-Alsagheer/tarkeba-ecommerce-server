export const getMailConfig = () => ({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    from: {
        name: process.env.MAIL_FROM_NAME || 'Tarkeba E-Commerce',
        address: process.env.MAIL_FROM || 'noreply@tarkeba.com',
    },
});
