/**
 * Gemini API Configuration
 * SECURE: Uses Environment Variables. NO HARDCODED KEYS.
 */

export const GEMINI_CONFIG = {
  // Primary API Key from Environment
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',

  // Fallback API Key (Optional)
  fallbackApiKey: import.meta.env.VITE_GEMINI_API_KEY_SECONDARY || '',

  // Model configuration
  model: 'gemini-2.0-flash',
  modelVision: 'gemini-2.0-flash',

  // API endpoints
  baseUrl: 'https://generativelanguage.googleapis.com',
  version: 'v1beta',
};

/**
 * Get API Key
 */
export function getGeminiApiKey(): string {
  if (!GEMINI_CONFIG.apiKey) {
    console.warn('Gemini API Key is missing! Check your VITE_GEMINI_API_KEY environment variable.');
  }
  return GEMINI_CONFIG.apiKey;
}
