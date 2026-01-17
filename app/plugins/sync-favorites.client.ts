export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    const favoritesStore = useFavoritesStore()
    await favoritesStore.initialize()
  })
})
