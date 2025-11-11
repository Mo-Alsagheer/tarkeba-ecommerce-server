// Helper method to generate OAuth password
export function generateOAuthPassword(email: string): string {
    const secret = process.env.GOOGLE_SECRET;

    if (!secret) {
        throw new Error('GOOGLE_SECRET is not configured');
    }

    return `${secret}${email}`;
}
