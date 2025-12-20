/**
 * Gemini API Configuration
 * This file contains the API key for production deployment
 */

export const GEMINI_CONFIG = {
  // Primary API Key
  apiKey: 'AIzaSyC6P-vWWOh6YSzZEanODgxouw_BHlqPqhM',
  
  // Fallback API Key (if primary fails)
  fallbackApiKey: 'AIzaSyBD_9VJ46qJKOf8GpCIhEEHjxL9bl4BcY8',
  
  // Model configuration
  model: 'gemini-2.0-flash',
  modelVision: 'gemini-2.0-flash',
  
  // API endpoints
  baseUrl: 'https://generativelanguage.googleapis.com',
  version: 'v1beta',
};

/**
 * Get API Key - Always use config (no environment variables)
 */
export function getGeminiApiKey(): string {
  // ALWAYS use the hardcoded config key
  // This ensures production deployment works
  return GEMINI_CONFIG.apiKey;
}
