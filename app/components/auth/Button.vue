<template>
  <UDropdown
    v-if="isAuthenticated"
    :items="menuItems"
    :popper="{ placement: 'bottom-end' }"
  >
    <button
      type="button"
      class="flex items-center justify-center rounded-full p-0.5 transition-all hover:ring-2 hover:ring-rp-iris/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
      :aria-label="user?.email || $t('auth.signOut')"
    >
      <UAvatar
        :src="user?.user_metadata?.avatar_url"
        :alt="user?.email || 'User'"
        size="sm"
        class="ring-2 ring-rp-overlay"
      />
    </button>
  </UDropdown>

  <button
    v-else
    type="button"
    class="flex items-center gap-2 rounded-xl bg-rp-iris px-4 py-2 text-sm font-medium text-rp-base transition-all hover:bg-rp-iris/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
    :aria-label="$t('auth.signIn')"
    @click="isModalOpen = true"
  >
    <UIcon
      name="i-heroicons-user-circle"
      class="size-4"
      aria-hidden="true"
    />
    <span class="hidden sm:inline">{{ $t('auth.signIn') }}</span>
  </button>

  <AuthModal v-model="isModalOpen" />
</template>

<script setup lang="ts">
const { user, isAuthenticated, signOut } = useAuth()
const { t } = useI18n()

const isModalOpen = ref(false)

const menuItems = computed(() => [
  [
    {
      label: user.value?.email || '',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: t('auth.signOut'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: signOut,
    },
  ],
])
</script>
