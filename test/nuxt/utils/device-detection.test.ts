import { describe, it, expect } from 'vitest'
import { isMobileUserAgent, getResponsiveLimit } from '~/utils/device-detection'

describe('device-detection utilities', () => {
  describe('isMobileUserAgent', () => {
    describe('mobile devices', () => {
      it('should detect Android phones', () => {
        const androidUA =
          'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
        expect(isMobileUserAgent(androidUA)).toBe(true)
      })

      it('should detect iPhones', () => {
        const iphoneUA =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
        expect(isMobileUserAgent(iphoneUA)).toBe(true)
      })

      it('should detect iPads', () => {
        const ipadUA =
          'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
        expect(isMobileUserAgent(ipadUA)).toBe(true)
      })

      it('should detect iPods', () => {
        const ipodUA =
          'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
        expect(isMobileUserAgent(ipodUA)).toBe(true)
      })

      it('should detect Windows Phone', () => {
        const windowsPhoneUA =
          'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254'
        expect(isMobileUserAgent(windowsPhoneUA)).toBe(true)
      })

      it('should detect BlackBerry', () => {
        const blackberryUA =
          'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+'
        expect(isMobileUserAgent(blackberryUA)).toBe(true)
      })

      it('should detect generic Mobile UA', () => {
        const mobileUA = 'Mozilla/5.0 (Mobile; rv:14.0) Gecko/14.0 Firefox/14.0'
        expect(isMobileUserAgent(mobileUA)).toBe(true)
      })

      it('should detect Tablet UA', () => {
        const tabletUA = 'Mozilla/5.0 (Tablet; rv:26.0) Gecko/26.0 Firefox/26.0'
        expect(isMobileUserAgent(tabletUA)).toBe(true)
      })

      it('should detect webOS devices', () => {
        const webosUA = 'Mozilla/5.0 (webOS/1.3; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0'
        expect(isMobileUserAgent(webosUA)).toBe(true)
      })
    })

    describe('desktop devices', () => {
      it('should not detect Windows desktop', () => {
        const windowsUA =
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        expect(isMobileUserAgent(windowsUA)).toBe(false)
      })

      it('should not detect macOS desktop', () => {
        const macUA =
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        expect(isMobileUserAgent(macUA)).toBe(false)
      })

      it('should not detect Linux desktop', () => {
        const linuxUA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        expect(isMobileUserAgent(linuxUA)).toBe(false)
      })

      it('should not detect Chrome OS', () => {
        const chromeOSUA =
          'Mozilla/5.0 (X11; CrOS x86_64 14092.77.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.107 Safari/537.36'
        expect(isMobileUserAgent(chromeOSUA)).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('should return false for null', () => {
        expect(isMobileUserAgent(null)).toBe(false)
      })

      it('should return false for undefined', () => {
        expect(isMobileUserAgent(undefined)).toBe(false)
      })

      it('should return false for empty string', () => {
        expect(isMobileUserAgent('')).toBe(false)
      })

      it('should handle case insensitivity', () => {
        expect(isMobileUserAgent('ANDROID')).toBe(true)
        expect(isMobileUserAgent('android')).toBe(true)
        expect(isMobileUserAgent('Android')).toBe(true)
      })
    })

    describe('bots and crawlers (treated as desktop)', () => {
      it('should treat Googlebot as desktop', () => {
        const googlebotUA =
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        expect(isMobileUserAgent(googlebotUA)).toBe(false)
      })

      it('should treat Bingbot as desktop', () => {
        const bingbotUA =
          'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        expect(isMobileUserAgent(bingbotUA)).toBe(false)
      })

      it('should detect Googlebot Mobile as mobile', () => {
        const googlebotMobileUA =
          'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        expect(isMobileUserAgent(googlebotMobileUA)).toBe(true)
      })
    })
  })

  describe('getResponsiveLimit', () => {
    const MOBILE_LIMIT = 12
    const DESKTOP_LIMIT = 24

    it('should return mobile limit for mobile user agent', () => {
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X)'
      expect(getResponsiveLimit(MOBILE_LIMIT, DESKTOP_LIMIT, mobileUA)).toBe(MOBILE_LIMIT)
    })

    it('should return desktop limit for desktop user agent', () => {
      const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      expect(getResponsiveLimit(MOBILE_LIMIT, DESKTOP_LIMIT, desktopUA)).toBe(DESKTOP_LIMIT)
    })

    it('should return desktop limit for null user agent', () => {
      expect(getResponsiveLimit(MOBILE_LIMIT, DESKTOP_LIMIT, null)).toBe(DESKTOP_LIMIT)
    })

    it('should return desktop limit for undefined user agent', () => {
      expect(getResponsiveLimit(MOBILE_LIMIT, DESKTOP_LIMIT, undefined)).toBe(DESKTOP_LIMIT)
    })

    it('should work with different limit values', () => {
      const mobileUA = 'Android Mobile'
      const desktopUA = 'Windows NT'

      expect(getResponsiveLimit(8, 15, mobileUA)).toBe(8)
      expect(getResponsiveLimit(8, 15, desktopUA)).toBe(15)
      expect(getResponsiveLimit(1, 100, mobileUA)).toBe(1)
      expect(getResponsiveLimit(1, 100, desktopUA)).toBe(100)
    })
  })
})
