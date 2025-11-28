/**
 * Admin Route Protection
 * Only allows specific admin emails to access admin dashboard
 */

export const ADMIN_EMAILS = [
  'aamir.shehzad99@gmail.com',
  'aamir.shehzad@gentleomegaai.space',
  // Add more admin emails here
];

export const isAdmin = (email: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
