export interface StreamingPlatformConfig {
  icon: string
  classes: string
}

export const STREAMING_PLATFORMS: Record<string, StreamingPlatformConfig> = {
  crunchyroll: {
    icon: 'i-simple-icons-crunchyroll',
    classes: 'bg-[#F47521] text-white hover:bg-[#ff8533]',
  },
  netflix: {
    icon: 'i-simple-icons-netflix',
    classes: 'bg-[#E50914] text-white hover:bg-[#ff1a1a]',
  },
  hulu: {
    icon: 'i-simple-icons-hulu',
    classes: 'bg-[#1CE783] text-black hover:bg-[#3dffa0]',
  },
  'amazon prime': {
    icon: 'i-simple-icons-primevideo',
    classes: 'bg-[#00A8E1] text-white hover:bg-[#1ab8f0]',
  },
  'prime video': {
    icon: 'i-simple-icons-primevideo',
    classes: 'bg-[#00A8E1] text-white hover:bg-[#1ab8f0]',
  },
  funimation: {
    icon: 'i-simple-icons-funimation',
    classes: 'bg-[#5B0BB5] text-white hover:bg-[#7a1ed6]',
  },
  'disney+': {
    icon: 'i-simple-icons-disneyplus',
    classes: 'bg-[#113CCF] text-white hover:bg-[#2952e0]',
  },
  'hbo max': {
    icon: 'i-simple-icons-hbo',
    classes: 'bg-[#B017E6] text-white hover:bg-[#c73df0]',
  },
  'tubi tv': {
    icon: 'i-heroicons-tv',
    classes: 'bg-[#FA382F] text-white hover:bg-[#ff5349]',
  },
  hidive: {
    icon: 'i-heroicons-play',
    classes: 'bg-[#00BAFF] text-white hover:bg-[#33c7ff]',
  },
}

export const DEFAULT_STREAMING_CONFIG: StreamingPlatformConfig = {
  icon: 'i-heroicons-play-circle',
  classes: 'bg-rp-surface text-white hover:bg-rp-overlay',
}

export function getStreamingPlatformConfig(name: string): StreamingPlatformConfig {
  return STREAMING_PLATFORMS[name.toLowerCase()] || DEFAULT_STREAMING_CONFIG
}
