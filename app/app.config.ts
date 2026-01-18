export default defineAppConfig({
  ui: {
    colors: {
      primary: 'fuchsia',
      secondary: 'pink',
      success: 'pink',
      warning: 'amber',
      error: 'rose',
      info: 'fuchsia',
      neutral: 'slate',
    },
    modal: {
      slots: {
        overlay: 'bg-rp-base/80 backdrop-blur-sm',
        content: 'bg-rp-surface ring-1 ring-rp-overlay',
      },
    },
    // Toast uses Nuxt UI's semantic colors which are overridden
    // via CSS variables in main.css for Rose Pine theme
  },
})
