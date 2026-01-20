/**
 * Nitro plugin to inject splash screen HTML into SSR response.
 *
 * This plugin only injects HTML and CSS (no inline JavaScript) to avoid CSP issues
 * with pre-rendered pages where the nonce would mismatch.
 *
 * The splash hiding logic is handled by the client plugin (splash-handler.client.ts)
 * which is bundled by Vite and doesn't have CSP issues.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    // Inject styles in the head (better practice than inline styles)
    html.head.push(`
      <style id="splash-styles">
        #splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #191724;
        }
        #splash-screen.hide {
          opacity: 0;
          transition: opacity 0.4s ease-out;
          pointer-events: none;
        }
        @keyframes splash-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.5rem); }
        }
        @keyframes splash-float {
          0%, 100% { transform: rotate(18deg) translateY(-0.75rem); }
          50% { transform: rotate(18deg) translateY(-0.5rem); }
        }
      </style>
    `)

    // Inject splash screen HTML at the start of body (no JavaScript)
    html.bodyPrepend.push(`
      <div id="splash-screen">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 2.25rem; font-weight: 700; font-family: system-ui, sans-serif;">
              <span style="color: #e0def4;">Vue</span>
              <span style="color: #c4a7e7;">Nime</span>
            </span>
            <img
              src="/images/straw-hat.webp"
              alt=""
              width="40"
              height="40"
              style="
                margin-left: -2rem;
                transform: rotate(18deg) translateY(-0.75rem);
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
                animation: splash-float 2s ease-in-out infinite;
              "
            />
          </div>
          <div style="display: flex; gap: 0.25rem;">
            <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: #c4a7e7; animation: splash-bounce 0.6s ease-in-out infinite; animation-delay: -0.3s;"></span>
            <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: #c4a7e7; animation: splash-bounce 0.6s ease-in-out infinite; animation-delay: -0.15s;"></span>
            <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background-color: #c4a7e7; animation: splash-bounce 0.6s ease-in-out infinite;"></span>
          </div>
        </div>
      </div>
    `)
  })
})
