// Professional IP Tracking with CORS Handling and Multiple Fallbacks

export interface IPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  isp: string;
  latitude: number;
  longitude: number;
}

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  screenResolution: string;
  colorDepth: string;
  language: string;
  platform: string;
  userAgent: string;
  hardwareConcurrency: number;
}

/**
 * Get client IP address with multiple fallback services
 */
export const getClientIP = async (): Promise<string> => {
  const services = [
    { url: 'https://api.ipify.org?format=json', key: 'ip' },
    { url: 'https://api64.ipify.org?format=json', key: 'ip' },
    { url: 'https://ipapi.co/json/', key: 'ip' },
    { url: 'https://api.ipapi.is/', key: 'ip' },
  ];

  for (const service of services) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(service.url, { 
        signal: controller.signal,
        mode: 'cors'
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        const ip = data[service.key];
        if (ip) {
          console.log(' IP detected from', service.url, ':', ip);
          return ip;
        }
      }
    } catch (error) {
      console.warn(' Failed to get IP from', service.url, error);
      continue;
    }
  }

  console.warn(' All IP services failed, using fallback');
  return 'unknown';
};

/**
 * Get detailed geolocation from IP
 */
export const getGeolocation = async (ip: string): Promise<IPInfo | null> => {
  if (ip === 'unknown') return null;

  const services = [
    {
      url: `https://ipapi.co/${ip}/json/`,
      parser: (data: any) => ({
        ip: data.ip || ip,
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'Unknown',
        isp: data.org || 'Unknown',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
      })
    },
    {
      url: `https://ipapi.is/?q=${ip}`,
      parser: (data: any) => ({
        ip: data.ip || ip,
        country: data.location?.country || 'Unknown',
        region: data.location?.state || 'Unknown',
        city: data.location?.city || 'Unknown',
        timezone: data.location?.timezone || 'Unknown',
        isp: data.company?.name || 'Unknown',
        latitude: data.location?.latitude || 0,
        longitude: data.location?.longitude || 0,
      })
    }
  ];

  for (const service of services) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(service.url, { 
        signal: controller.signal,
        mode: 'cors'
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        const geoInfo = service.parser(data);
        console.log(' Geolocation retrieved:', geoInfo);
        return geoInfo;
      }
    } catch (error) {
      console.warn(' Geolocation service failed:', error);
      continue;
    }
  }

  console.warn(' All geolocation services failed');
  return null;
};

/**
 * Get comprehensive device information
 */
export const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;
  
  // Enhanced browser detection
  let browser = 'Unknown';
  let browserVersion = '';
  if (ua.includes('Edg/')) {
    browser = 'Edge';
    browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
    browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
    browser = 'Opera';
    browserVersion = ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || '';
  }

  // Enhanced OS detection
  let os = 'Unknown';
  let osVersion = '';
  if (ua.includes('Windows NT 10.0')) { os = 'Windows'; osVersion = '10/11'; }
  else if (ua.includes('Windows NT 6.3')) { os = 'Windows'; osVersion = '8.1'; }
  else if (ua.includes('Windows NT 6.2')) { os = 'Windows'; osVersion = '8'; }
  else if (ua.includes('Windows NT 6.1')) { os = 'Windows'; osVersion = '7'; }
  else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    osVersion = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  }
  else if (ua.includes('Android')) {
    os = 'Android';
    osVersion = ua.match(/Android ([\d.]+)/)?.[1] || '';
  }
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    osVersion = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  }
  else if (ua.includes('Linux')) { os = 'Linux'; }

  // Device type detection
  let device = 'Desktop';
  if (/Mobile|Android|iPhone|iPod/.test(ua)) {
    device = 'Mobile';
  } else if (/Tablet|iPad/.test(ua)) {
    device = 'Tablet';
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: `${window.screen.colorDepth}-bit`,
    language: navigator.language,
    platform: navigator.platform,
    userAgent: ua,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
  };
};

/**
 * Generate device fingerprint using SHA-256
 */
export const generateDeviceFingerprint = async (): Promise<string> => {
  const deviceInfo = getDeviceInfo();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const components = [
    deviceInfo.userAgent,
    deviceInfo.screenResolution,
    deviceInfo.colorDepth,
    timezone,
    deviceInfo.language,
    deviceInfo.platform,
    deviceInfo.hardwareConcurrency.toString(),
    navigator.maxTouchPoints?.toString() || '0',
    new Date().getTimezoneOffset().toString(),
  ].join('|');

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(components);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error(' Fingerprint generation failed:', error);
    // Fallback to simple hash
    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
};

/**
 * Get complete session information with error handling
 */
export const getSessionInfo = async () => {
  try {
    console.log(' Starting session info collection...');
    
    // Collect device info (always works)
    const deviceInfo = getDeviceInfo();
    const fingerprint = await generateDeviceFingerprint();
    
    console.log(' Device info collected:', deviceInfo);
    console.log(' Fingerprint generated:', fingerprint);
    
    // Try to get IP (may fail due to CORS/network)
    const ip = await getClientIP();
    
    // Try to get geolocation (may fail)
    const geoInfo = ip !== 'unknown' ? await getGeolocation(ip) : null;
    
    return {
      ip,
      geolocation: geoInfo,
      device: deviceInfo,
      fingerprint,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(' Error getting session info:', error);
    
    // Graceful degradation - return basic info
    return {
      ip: 'unknown',
      geolocation: null,
      device: getDeviceInfo(),
      fingerprint: await generateDeviceFingerprint(),
      timestamp: new Date().toISOString(),
    };
  }
};
