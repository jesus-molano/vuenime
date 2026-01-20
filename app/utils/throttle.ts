/**
 * Creates a throttled function that executes at most once per animation frame.
 * Uses requestAnimationFrame for smooth scroll/resize handlers.
 *
 * @param fn - The function to throttle
 * @returns Throttled function with a cancel method
 */
export function rafThrottle<T extends (...args: unknown[]) => void>(
  fn: T
): T & { cancel: () => void } {
  let frameId: number | null = null
  let lastArgs: Parameters<T> | null = null

  const throttled = ((...args: Parameters<T>) => {
    lastArgs = args
    if (frameId === null) {
      frameId = requestAnimationFrame(() => {
        frameId = null
        if (lastArgs) {
          fn(...lastArgs)
          lastArgs = null
        }
      })
    }
  }) as T & { cancel: () => void }

  throttled.cancel = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
    lastArgs = null
  }

  return throttled
}
