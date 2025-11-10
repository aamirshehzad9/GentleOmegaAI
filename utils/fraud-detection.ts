// Professional Fraud Detection with Statistical Analysis

import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface FraudAlert {
  userId: string;
  email: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  details: Record<string, any>;
  timestamp: Date;
}

/**
 * Check if IP has too many accounts (max 3 per IP)
 */
export const checkIPAccountLimit = async (ip: string): Promise<{ exceeded: boolean; count: number; accounts: string[] }> => {
  if (ip === 'unknown') return { exceeded: false, count: 0, accounts: [] };

  try {
    const sessionsRef = collection(db, 'user_sessions');
    const q = query(
      sessionsRef,
      where('ip', '==', ip),
      where('action', '==', 'signup')
    );
    
    const snapshot = await getDocs(q);
    const uniqueUsers = new Set<string>();
    const accounts: string[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      uniqueUsers.add(data.userId);
      accounts.push(data.email);
    });
    
    const count = uniqueUsers.size;
    const exceeded = count >= 3;
    
    if (exceeded) {
      console.warn(` IP ${ip} has ${count} accounts (limit: 3)`);
    }
    
    return { exceeded, count, accounts };
  } catch (error) {
    console.error(' Error checking IP limit:', error);
    return { exceeded: false, count: 0, accounts: [] };
  }
};

/**
 * Check if device fingerprint has too many accounts (max 3 per device)
 */
export const checkDeviceFingerprintLimit = async (fingerprint: string): Promise<{ exceeded: boolean; count: number; accounts: string[] }> => {
  try {
    const sessionsRef = collection(db, 'user_sessions');
    const q = query(
      sessionsRef,
      where('deviceFingerprint', '==', fingerprint),
      where('action', '==', 'signup')
    );
    
    const snapshot = await getDocs(q);
    const uniqueUsers = new Set<string>();
    const accounts: string[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      uniqueUsers.add(data.userId);
      accounts.push(data.email);
    });
    
    const count = uniqueUsers.size;
    const exceeded = count >= 3;
    
    if (exceeded) {
      console.warn(` Device ${fingerprint.substring(0, 8)}... has ${count} accounts (limit: 3)`);
    }
    
    return { exceeded, count, accounts };
  } catch (error) {
    console.error(' Error checking device limit:', error);
    return { exceeded: false, count: 0, accounts: [] };
  }
};

/**
 * Check for rapid account creation (velocity check)
 */
export const checkVelocity = async (ip: string): Promise<{ suspicious: boolean; recentCount: number }> => {
  if (ip === 'unknown') return { suspicious: false, recentCount: 0 };

  try {
    const sessionsRef = collection(db, 'user_sessions');
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const q = query(
      sessionsRef,
      where('ip', '==', ip),
      where('action', '==', 'signup'),
      where('timestamp', '>=', Timestamp.fromDate(oneDayAgo))
    );
    
    const snapshot = await getDocs(q);
    const recentCount = snapshot.size;
    const suspicious = recentCount >= 5; // 5+ signups in 24 hours = suspicious
    
    if (suspicious) {
      console.warn(` Rapid signup velocity detected: ${recentCount} signups from ${ip} in 24 hours`);
    }
    
    return { suspicious, recentCount };
  } catch (error) {
    console.error(' Error checking velocity:', error);
    return { suspicious: false, recentCount: 0 };
  }
};

/**
 * Check for disposable email domains
 */
export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
    'mailinator.com', 'trashmail.com', 'fakeinbox.com', 'temp-mail.org',
    'yopmail.com', 'maildrop.cc', 'getnada.com', 'getairmail.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.some(d => domain?.includes(d));
};

/**
 * Comprehensive fraud check
 */
export const performFraudCheck = async (
  userId: string,
  email: string,
  ip: string,
  fingerprint: string
): Promise<FraudAlert | null> => {
  console.log(' Running fraud detection checks...');
  
  const checks = await Promise.all([
    checkIPAccountLimit(ip),
    checkDeviceFingerprintLimit(fingerprint),
    checkVelocity(ip),
  ]);
  
  const [ipCheck, deviceCheck, velocityCheck] = checks;
  
  // Calculate risk score
  let riskScore = 0;
  const reasons: string[] = [];
  const details: Record<string, any> = {};
  
  // IP-based checks
  if (ipCheck.exceeded) {
    riskScore += 40;
    reasons.push(`IP has ${ipCheck.count} accounts (limit: 3)`);
    details.ipAccounts = ipCheck.accounts;
  }
  
  // Device-based checks
  if (deviceCheck.exceeded) {
    riskScore += 40;
    reasons.push(`Device has ${deviceCheck.count} accounts (limit: 3)`);
    details.deviceAccounts = deviceCheck.accounts;
  }
  
  // Velocity check
  if (velocityCheck.suspicious) {
    riskScore += 30;
    reasons.push(`${velocityCheck.recentCount} signups in 24 hours`);
    details.velocityCount = velocityCheck.recentCount;
  }
  
  // Disposable email check
  if (isDisposableEmail(email)) {
    riskScore += 20;
    reasons.push('Disposable email domain detected');
    details.disposableEmail = true;
  }
  
  // Determine risk level
  let riskLevel: FraudAlert['riskLevel'];
  if (riskScore >= 80) riskLevel = 'critical';
  else if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';
  else riskLevel = 'low';
  
  // Only create alert if risk is medium or above
  if (riskScore < 30) {
    console.log(' No fraud detected (risk score:', riskScore, ')');
    return null;
  }
  
  console.warn(` Fraud alert: ${riskLevel} risk (score: ${riskScore})`);
  console.warn('Reasons:', reasons);
  
  return {
    userId,
    email,
    riskLevel,
    reason: reasons.join('; '),
    details: {
      ...details,
      riskScore,
      ip,
      fingerprint: fingerprint.substring(0, 16) + '...',
    },
    timestamp: new Date(),
  };
};

/**
 * Log fraud alert to Firestore
 */
export const logFraudAlert = async (alert: FraudAlert): Promise<void> => {
  try {
    const alertsRef = collection(db, 'fraud_alerts');
    await addDoc(alertsRef, {
      ...alert,
      timestamp: serverTimestamp(),
    });
    console.log(' Fraud alert logged to Firestore');
  } catch (error) {
    console.error(' Failed to log fraud alert:', error);
  }
};

/**
 * Check if user should be blocked from signup
 */
export const shouldBlockSignup = (alert: FraudAlert | null): boolean => {
  if (!alert) return false;
  return alert.riskLevel === 'critical' || alert.riskLevel === 'high';
};
