import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
                type: 'module',
            },
            manifest: {
                lang: 'en',
                name: 'SMX',
                short_name: 'SMX',
                start_url: '/',
                display: 'standalone',
                theme_color: '#121212',
                background_color: '#ffffff',
                icons: [
                    { src: '/favicon_512x512.png', sizes: '512x512', type: 'image/png' },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }: { request: Request }) => request.destination === 'document',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'html-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
                        },
                    },
                    {
                        urlPattern: ({ request }: { request: Request }) =>
                            ['style', 'script', 'worker'].includes(request.destination),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'static-resources',
                            expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
                        },
                    },
                    {
                        urlPattern: ({ request }: { request: Request }) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: { maxEntries: 30, maxAgeSeconds: 30 * 24 * 60 * 60 },
                        },
                    },
                ],
            }
        }),
    ],
});
