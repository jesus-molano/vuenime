export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    const watchedStore = useWatchedStore()
    await watchedStore.initialize()
  })
})
