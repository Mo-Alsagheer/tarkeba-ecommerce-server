export const getMailConfig = () => ({
    from: {
        name: process.env.MAIL_FROM_NAME || 'Tarkeba E-Commerce',
        address: process.env.MAIL_FROM || 'onboarding@resend.dev',
    },
});
