const AUTH_REDIRECT_KEY = 'auth_redirect_path'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const localePath = useLocalePath()
  const route = useRoute()

  const isAuthenticated = computed(() => !!user.value)

  const redirectUrl = computed(() => {
    if (import.meta.client) {
      return `${window.location.origin}${localePath('/confirm')}`
    }
    return localePath('/confirm')
  })

  // Save current path before OAuth redirect
  function saveRedirectPath() {
    if (import.meta.client) {
      const currentPath = route.fullPath
      // Don't save auth-related pages
      if (!currentPath.includes('/confirm') && !currentPath.includes('/reset-password')) {
        localStorage.setItem(AUTH_REDIRECT_KEY, currentPath)
      }
    }
  }

  async function signInWithGoogle() {
    saveRedirectPath()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.value,
      },
    })
    if (error) throw error
  }

  async function signInWithGitHub() {
    saveRedirectPath()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl.value,
      },
    })
    if (error) throw error
  }

  async function signInWithEmail(email: string, password: string) {
    saveRedirectPath()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.value,
      },
    })
    if (error) throw error
  }

  async function resetPassword(email: string) {
    const resetRedirectUrl = import.meta.client
      ? `${window.location.origin}${localePath('/reset-password')}`
      : localePath('/reset-password')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetRedirectUrl,
    })
    if (error) throw error
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    isAuthenticated,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    updatePassword,
    signOut,
  }
}
