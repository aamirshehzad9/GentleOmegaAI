// Professional Session Logger with IP Tracking and Fraud Detection

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getSessionInfo } from './ip-tracking';
import { performFraudCheck, logFraudAlert, shouldBlockSignup } from './fraud-detection';

export const logUserSession = async (
  userId: string,
  email: string,
  action: 'login' | 'signup'
) => {
  try {
    console.log(`[IP-TRACKING] Logging ${action} session for: ${email}`);
    
    // Get comprehensive session info (IP, geolocation, device, fingerprint)
    const sessionInfo = await getSessionInfo();
    
    console.log('[IP-TRACKING] Session info collected:', {
      ip: sessionInfo.ip,
      device: sessionInfo.device.browser + ' ' + sessionInfo.device.browserVersion,
      os: sessionInfo.device.os + ' ' + sessionInfo.device.osVersion,
      country: sessionInfo.geolocation?.country,
      city: sessionInfo.geolocation?.city,
    });
    
    // Perform fraud detection BEFORE allowing signup
    if (action === 'signup') {
      const fraudAlert = await performFraudCheck(
        userId,
        email,
        sessionInfo.ip,
        sessionInfo.fingerprint
      );
      
      if (fraudAlert) {
        await logFraudAlert(fraudAlert);
        
        if (shouldBlockSignup(fraudAlert)) {
          console.error('[FRAUD-BLOCK] High fraud risk:', fraudAlert.reason);
          throw new Error(`Account creation blocked: ${fraudAlert.reason}. Please contact support if you believe this is an error.`);
        } else {
          console.warn('[FRAUD-WARNING] Suspicious signup allowed:', fraudAlert.reason);
        }
      }
    }
    
    // Log session to Firestore
    const sessionsRef = collection(db, 'user_sessions');
    await addDoc(sessionsRef, {
      // User info
      userId,
      email,
      action,
      isActive: action === 'login',
      
      // IP & Geolocation
      ip: sessionInfo.ip,
      country: sessionInfo.geolocation?.country || 'Unknown',
      region: sessionInfo.geolocation?.region || 'Unknown',
      city: sessionInfo.geolocation?.city || 'Unknown',
      timezone: sessionInfo.geolocation?.timezone || 'Unknown',
      isp: sessionInfo.geolocation?.isp || 'Unknown',
      latitude: sessionInfo.geolocation?.latitude || 0,
      longitude: sessionInfo.geolocation?.longitude || 0,
      
      // Device info
      browser: sessionInfo.device.browser,
      browserVersion: sessionInfo.device.browserVersion,
      os: sessionInfo.device.os,
      osVersion: sessionInfo.device.osVersion,
      device: sessionInfo.device.device,
      screenResolution: sessionInfo.device.screenResolution,
      colorDepth: sessionInfo.device.colorDepth,
      language: sessionInfo.device.language,
      platform: sessionInfo.device.platform,
      hardwareConcurrency: sessionInfo.device.hardwareConcurrency,
      
      // Security
      deviceFingerprint: sessionInfo.fingerprint,
      userAgent: sessionInfo.device.userAgent,
      
      // Timestamp
      timestamp: serverTimestamp(),
    });
    
    console.log('[IP-TRACKING] Session logged successfully with FULL data');
  } catch (error: any) {
    console.error('[IP-TRACKING] Error:', error);
    
    // If it's a fraud block error, re-throw it
    if (error.message?.includes('Account creation blocked')) {
      throw error;
    }
    
    // For other errors, log but don't block the auth flow
    console.warn('[IP-TRACKING] Session logging failed but allowing auth to continue');
  }
};