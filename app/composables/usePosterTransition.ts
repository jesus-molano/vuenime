const SM_BREAKPOINT = 640

export function usePosterTransition(animeId: MaybeRefOrGetter<number>) {
  const isDesktop = ref(false)

  onMounted(() => {
    isDesktop.value = window.innerWidth >= SM_BREAKPOINT
  })

  const posterStyle = computed(() => ({
    viewTransitionName: isDesktop.value ? `poster-${toValue(animeId)}` : 'none',
    clipPath: 'inset(0 round 1rem)',
  }))

  return { posterStyle }
}
