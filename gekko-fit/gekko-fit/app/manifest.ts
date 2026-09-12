import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GEKKO FIT',
    short_name: 'GEKKO FIT',
    description: 'Трекер тренировок с системой XP и рангами',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0D0D0D',
    theme_color: '#0D0D0D',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '1024x1024',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
  };
}