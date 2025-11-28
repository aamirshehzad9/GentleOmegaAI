/**
 * WhatsApp Integration Service
 * Uses Firebase Cloud Functions to send/receive WhatsApp messages via Twilio
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

/**
 * Send WhatsApp message to a phone number
 */
export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageSid?: string; error?: string }> => {
  try {
    const sendMessage = httpsCallable(functions, 'sendWhatsAppMessage');
    const result = await sendMessage({ to: phoneNumber, message });
    
    const data = result.data as any;
    return {
      success: data.success,
      messageSid: data.messageSid
    };
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send OTP via WhatsApp
 */
export const sendWhatsAppOTP = async (
  phoneNumber: string
): Promise<{ success: boolean; otpId?: string; error?: string }> => {
  try {
    const sendOTP = httpsCallable(functions, 'sendWhatsAppOTP');
    const result = await sendOTP({ phoneNumber });
    
    const data = result.data as any;
    return {
      success: data.success,
      otpId: data.otpId
    };
  } catch (error: any) {
    console.error('Error sending WhatsApp OTP:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify WhatsApp OTP
 */
export const verifyWhatsAppOTP = async (
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const verifyOTP = httpsCallable(functions, 'verifyWhatsAppOTP');
    const result = await verifyOTP({ phoneNumber, code });
    
    const data = result.data as any;
    return {
      success: data.success,
      message: data.message
    };
  } catch (error: any) {
    console.error('Error verifying WhatsApp OTP:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get WhatsApp conversations (admin only)
 */
export const getWhatsAppConversations = async (
  phoneNumber?: string,
  limit: number = 50
): Promise<{ success: boolean; messages?: any[]; error?: string }> => {
  try {
    const getConversations = httpsCallable(functions, 'getWhatsAppConversations');
    const result = await getConversations({ phoneNumber, limit });
    
    const data = result.data as any;
    return {
      success: data.success,
      messages: data.messages
    };
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Quick WhatsApp support button - Opens WhatsApp chat
 * This doesn't require API, just opens WhatsApp directly
 */
export const openWhatsAppChat = (phoneNumber: string = '+923468066680', message?: string) => {
  const baseUrl = 'https://wa.me/';
  const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  
  window.open(`${baseUrl}${formattedNumber}${encodedMessage}`, '_blank');
};
