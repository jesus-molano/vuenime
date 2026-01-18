import { vScrollReveal } from '~/composables/useScrollReveal'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('scroll-reveal', vScrollReveal)
})
