// Server-side no-op directive for SSR compatibility
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('scroll-reveal', {
    getSSRProps() {
      return {}
    },
  })
})
