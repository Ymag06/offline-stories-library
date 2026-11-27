import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function offlineAppShell() {
  return {
    name: 'offline-app-shell',
    apply: 'build',
    generateBundle(_options, bundle) {
      const builtFiles = Object.keys(bundle)
        .filter((fileName) => !fileName.endsWith('.map'))
        .map((fileName) => `/${fileName}`)
      const hareAndTortoiseAssets = [
        '/stories/hare-and-tortoise/cover.png',
        ...Array.from({ length: 5 }, (_, index) => `/stories/hare-and-tortoise/page-${index + 1}.png`),
        '/stories/hare-and-tortoise/audio-en.mp3',
        '/stories/hare-and-tortoise/audio-my.mp3',
      ]
      const precache = [...new Set([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/storybook.svg',
        ...hareAndTortoiseAssets,
        ...builtFiles,
      ])]
      const cacheName = `story-library-${Date.now()}`
      const source = `
const CACHE_NAME = ${JSON.stringify(cacheName)};
const PRECACHE_URLS = ${JSON.stringify(precache)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('story-library-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.headers.has('range')) {
    event.respondWith((async () => {
      const cached = await caches.match(request.url);
      if (!cached) return fetch(request);

      const audio = await cached.blob();
      const range = request.headers.get('range') || '';
      const match = /^bytes=(\\d*)-(\\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + audio.size } });
      }

      const start = match[1] ? Number(match[1]) : Math.max(0, audio.size - Number(match[2]));
      const end = match[1] && match[2] ? Math.min(Number(match[2]), audio.size - 1) : audio.size - 1;
      if (start > end || start >= audio.size) {
        return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + audio.size } });
      }

      const headers = new Headers(cached.headers);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + audio.size);
      headers.set('Content-Length', String(end - start + 1));
      return new Response(audio.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
    })());
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('/index.html')) || (await caches.match('/')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});
`
      this.emitFile({ type: 'asset', fileName: 'sw.js', source })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), offlineAppShell()],
})

