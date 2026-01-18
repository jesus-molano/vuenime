export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    const favoritesStore = useFavoritesStore()
    // isLoading starts as true, initialize() will:
    // - Fetch from Supabase if user is logged in
    // - Set isLoading=false if no user (show local data)
    await favoritesStore.initialize()
  })
})
