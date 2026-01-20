import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { rafThrottle } from '~/utils/throttle'

describe('rafThrottle', () => {
  let rafCallbacks: Array<FrameRequestCallback>
  let rafId: number

  beforeEach(() => {
    rafCallbacks = []
    rafId = 0

    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback)
      return ++rafId
    })

    // Mock cancelAnimationFrame
    vi.stubGlobal('cancelAnimationFrame', (_id: number) => {
      // Mark as cancelled - in real implementation we'd remove from queue
      // For simplicity, we just track that cancel was called
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    rafCallbacks = []
  })

  // Helper to flush all RAF callbacks
  const flushRAF = () => {
    const callbacks = [...rafCallbacks]
    rafCallbacks = []
    callbacks.forEach((cb) => cb(performance.now()))
  }

  it('should call function once per animation frame', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled()
    throttled()
    throttled()

    // Not called yet - waiting for RAF
    expect(fn).not.toHaveBeenCalled()

    // Trigger RAF
    flushRAF()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass latest arguments to function', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled('first')
    throttled('second')
    throttled('third')

    flushRAF()

    expect(fn).toHaveBeenCalledWith('third')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should cancel pending calls', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled()
    throttled.cancel()

    flushRAF()

    expect(fn).not.toHaveBeenCalled()
  })

  it('should allow new calls after cancel', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled('first')
    throttled.cancel()

    // New call after cancel
    throttled('second')
    flushRAF()

    expect(fn).toHaveBeenCalledWith('second')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should allow subsequent calls after RAF fires', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    // First batch
    throttled('batch1')
    flushRAF()
    expect(fn).toHaveBeenCalledWith('batch1')

    // Second batch
    throttled('batch2')
    flushRAF()
    expect(fn).toHaveBeenCalledWith('batch2')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple arguments', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled('arg1', 'arg2', 123)
    flushRAF()

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })

  it('should not call function when cancelled before RAF', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    // Schedule calls
    throttled('a')
    throttled('b')

    // Cancel before RAF fires
    throttled.cancel()

    // Even if RAF fires now, function shouldn't be called
    flushRAF()

    expect(fn).not.toHaveBeenCalled()
  })

  it('should return correct type with cancel method', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    // Should be callable
    expect(typeof throttled).toBe('function')

    // Should have cancel method
    expect(typeof throttled.cancel).toBe('function')
  })

  it('should handle rapid sequential calls', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    // Simulate rapid scroll events
    for (let i = 0; i < 100; i++) {
      throttled(i)
    }

    flushRAF()

    // Should only be called once with the last value
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(99)
  })

  it('should clear lastArgs after execution', () => {
    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled('first')
    flushRAF()
    expect(fn).toHaveBeenCalledWith('first')

    // Second round without new calls
    flushRAF()

    // Should still only have been called once
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
