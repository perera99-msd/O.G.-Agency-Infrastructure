import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OG Agency Mobile App',
    short_name: 'OG Agency',
    description: 'OG Agency Mobile Application',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1115',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
