import { vi } from 'vitest'

// ============================================
// IntersectionObserver Mocks
// ============================================

export interface MockIntersectionObserverInstance {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

export interface IntersectionObserverMock {
  instance: MockIntersectionObserverInstance
  callback: IntersectionObserverCallback | null
  simulateIntersection: (isIntersecting: boolean, target?: Element) => void
}

/**
 * Creates a simple IntersectionObserver mock for basic use cases.
 * Call in beforeEach and use simulateIntersection to trigger callbacks.
 */
export function createMockIntersectionObserver(): IntersectionObserverMock {
  const mock: IntersectionObserverMock = {
    instance: {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    },
    callback: null,
    simulateIntersection: (isIntersecting: boolean, target?: Element) => {
      if (!mock.callback) return
      mock.callback(
        [
          {
            isIntersecting,
            target: target || document.createElement('div'),
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: isIntersecting ? 1 : 0,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          },
        ],
        mock.instance as unknown as IntersectionObserver
      )
    },
  }

  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((callback: IntersectionObserverCallback) => {
      mock.callback = callback
      return mock.instance
    })
  )

  return mock
}

/**
 * Class-based IntersectionObserver mock for more complex scenarios.
 * Tracks observed elements and allows triggering intersections.
 */
export class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  elements: Element[] = []
  options?: IntersectionObserverInit

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter((el) => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  trigger(isIntersecting: boolean) {
    const entries = this.elements.map((element) => ({
      isIntersecting,
      target: element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    }))
    this.callback(entries, this as unknown as IntersectionObserver)
  }
}

/**
 * Installs the class-based IntersectionObserver mock globally.
 * Returns the last created instance for triggering intersections.
 */
export function installMockIntersectionObserver(): { getLastInstance: () => MockIntersectionObserver | null } {
  let lastInstance: MockIntersectionObserver | null = null

  vi.stubGlobal('IntersectionObserver', function (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    lastInstance = new MockIntersectionObserver(callback, options)
    return lastInstance
  })

  return {
    getLastInstance: () => lastInstance,
  }
}

// ============================================
// ResizeObserver Mock
// ============================================

export interface MockResizeObserverInstance {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

export function createMockResizeObserver(): MockResizeObserverInstance {
  const instance: MockResizeObserverInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }

  vi.stubGlobal(
    'ResizeObserver',
    vi.fn(() => instance)
  )

  return instance
}

// ============================================
// LocalStorage Mock
// ============================================

export interface MockLocalStorage {
  store: Record<string, string>
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
  removeItem: ReturnType<typeof vi.fn>
  clear: ReturnType<typeof vi.fn>
}

export function createMockLocalStorage(initialData: Record<string, string> = {}): MockLocalStorage {
  const store: Record<string, string> = { ...initialData }

  const mock: MockLocalStorage = {
    store,
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      Reflect.deleteProperty(store, key)
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => Reflect.deleteProperty(store, key))
    }),
  }

  vi.stubGlobal('localStorage', mock)

  return mock
}

// ============================================
// Scroll Behavior Mocks
// ============================================

export interface MockScrollBehavior {
  scrollTo: ReturnType<typeof vi.fn>
  scrollListeners: Array<() => void>
  setScrollY: (value: number) => void
  triggerScroll: () => void
}

export function createMockScrollBehavior(): MockScrollBehavior {
  const scrollListeners: Array<() => void> = []
  const scrollTo = vi.fn()

  vi.stubGlobal('scrollTo', scrollTo)

  const originalAddEventListener = window.addEventListener.bind(window)
  vi.stubGlobal('addEventListener', (event: string, handler: EventListener, options?: boolean | AddEventListenerOptions) => {
    if (event === 'scroll') {
      scrollListeners.push(handler as () => void)
    }
    return originalAddEventListener(event, handler, options)
  })

  Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
    configurable: true,
  })

  return {
    scrollTo,
    scrollListeners,
    setScrollY: (value: number) => {
      Object.defineProperty(window, 'scrollY', {
        value,
        writable: true,
        configurable: true,
      })
    },
    triggerScroll: () => {
      scrollListeners.forEach((listener) => listener())
    },
  }
}

// ============================================
// Animation Mock
// ============================================

export interface MockAnimation {
  finished: Promise<void>
  play: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  cancel: ReturnType<typeof vi.fn>
  finish: ReturnType<typeof vi.fn>
}

export function createMockAnimation(): MockAnimation {
  return {
    finished: Promise.resolve(),
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
    finish: vi.fn(),
  }
}

/**
 * Creates a controllable animation mock where you control when it finishes.
 */
export function createControllableAnimation(): MockAnimation & { resolve: () => void } {
  let resolveAnimation: () => void = () => {}

  const animation: MockAnimation & { resolve: () => void } = {
    finished: new Promise<void>((resolve) => {
      resolveAnimation = resolve
    }),
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
    finish: vi.fn(),
    resolve: () => resolveAnimation(),
  }

  return animation
}

// ============================================
// matchMedia Mock
// ============================================

export function createMockMatchMedia(matches: boolean = false) {
  const mock = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  vi.stubGlobal('matchMedia', mock)

  return mock
}

// ============================================
// Cleanup Helper
// ============================================

/**
 * Call in afterEach to clean up all global mocks.
 */
export function cleanupBrowserMocks() {
  vi.unstubAllGlobals()
}
