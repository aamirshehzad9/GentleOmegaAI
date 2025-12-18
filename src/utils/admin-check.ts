export const isAdmin = (email: string | null): boolean => {
    if (!email) return false;
    // TODO: Add actual admin email list or logic here
    // For now allowing specific testing emails or domain
    const allowedAdmins = [
        'admin@gentleomegaai.space',
        'test@gentleomegaai.space',
        'aamir.shehzad@gentleomegaai.space',
        'aamir.shehzad99@gmail.com'
    ];
    return allowedAdmins.includes(email) || email.endsWith('@gentleomegaai.space');
};
