/**
 * Auth middleware that redirects unauthenticated users to home
 * Preserves the intended destination in the redirect query param
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    // Preserve redirect path so user can return after login
    const query = to.fullPath !== '/' ? { redirect: to.fullPath } : undefined
    return navigateTo({ path: '/', query })
  }
})
