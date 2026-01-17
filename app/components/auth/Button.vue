<template>
  <UDropdownMenu
    v-if="isAuthenticated"
    :items="menuItems"
    :content="{ align: 'end' }"
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
  </UDropdownMenu>

  <button
    v-else
    type="button"
    class="group flex items-center gap-1.5 rounded-xl bg-rp-iris/10 px-3 py-1.5 text-sm font-medium text-rp-iris transition-all hover:bg-rp-iris/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
    :aria-label="$t('auth.signIn')"
    @click="isModalOpen = true"
  >
    <UIcon
      name="i-heroicons-user-circle"
      class="size-6 sm:size-4"
      aria-hidden="true"
    />
    <span class="hidden whitespace-nowrap sm:inline">{{ $t('auth.signIn') }}</span>
    <span class="sr-only sm:hidden">{{ $t('auth.signIn') }}</span>
  </button>

  <AuthModal v-model="isModalOpen" />
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { user, isAuthenticated, signOut } = useAuth()
const { t } = useI18n()

const isModalOpen = ref(false)

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: user.value?.email || '',
      disabled: true,
    },
  ],
  [
    {
      label: t('auth.signOut'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect: signOut,
    },
  ],
])
</script>
