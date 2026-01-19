/**
 * Server-side mobile detection via User-Agent
 * Used during SSR to determine initial data limits
 */

const MOBILE_UA_PATTERNS = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /Windows Phone/i,
  /Mobile/i,
  /Tablet/i,
]

/**
 * Check if User-Agent indicates a mobile device
 * Conservative: returns false if UA is not available (treats bots as desktop)
 */
export function isMobileUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  return MOBILE_UA_PATTERNS.some((pattern) => pattern.test(userAgent))
}

/**
 * Get the appropriate limit based on device type
 * @param mobileLimit - Limit for mobile devices
 * @param desktopLimit - Limit for desktop devices
 * @param userAgent - User-Agent string from request headers
 */
export function getResponsiveLimit(mobileLimit: number, desktopLimit: number, userAgent: string | null | undefined): number {
  return isMobileUserAgent(userAgent) ? mobileLimit : desktopLimit
}
