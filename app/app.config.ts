export default defineAppConfig({
  ui: {
    colors: {
      primary: 'fuchsia',
      secondary: 'pink',
      success: 'cyan',
      warning: 'amber',
      error: 'rose',
      neutral: 'slate',
    },
    modal: {
      slots: {
        overlay: 'bg-rp-base/80 backdrop-blur-sm',
        content: 'bg-rp-surface ring-1 ring-rp-overlay',
      },
    },
  },
})
