export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  const isAuthenticated = computed(() => !!user.value)

  const redirectUrl = computed(() => {
    if (import.meta.client) {
      return `${window.location.origin}${localePath('/confirm')}`
    }
    return localePath('/confirm')
  })

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.value,
      },
    })
    if (error) throw error
  }

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl.value,
      },
    })
    if (error) throw error
  }

  async function signInWithEmail(email: string, password: string) {
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
