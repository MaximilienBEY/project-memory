// import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { clientsClaim } from "workbox-core"
// import { ExpirationPlugin } from "workbox-expiration"
import { precacheAndRoute } from "workbox-precaching"
// import { registerRoute } from "workbox-routing"
// import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies"

declare let self: ServiceWorkerGlobalScope

clientsClaim()

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})
// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// const fileExtensionRegexp = /\/[^/?]+\.[^/]+$/
// // Caching assets with a stale while revalidate strategy.
// registerRoute(
//   ({ url }) => {
//     if (!url.pathname.startsWith("/assets")) return false
//     if (url.pathname.match(fileExtensionRegexp)) return false

//     return true
//   },
//   new StaleWhileRevalidate({
//     cacheName: "static-resources",
//   }),
// )

// // Cache the Google Fonts stylesheets with a stale while revalidate strategy.
// registerRoute(
//   /^https:\/\/fonts\.googleapis\.com/,
//   new StaleWhileRevalidate({
//     cacheName: "google-fonts-stylesheets",
//   }),
// )

// // Cache the underlying font files with a cache first strategy for 1 year.
// registerRoute(
//   /^https:\/\/fonts\.gstatic\.com/,
//   new CacheFirst({
//     cacheName: "google-fonts-webfonts",
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         maxAgeSeconds: 60 * 60 * 24 * 365,
//         maxEntries: 30,
//       }),
//     ],
//   }),
// )

// // Cache the wasm file from ffmpeg with a cache first strategy for 1 year, url: https://unpkg.com/@ffmpeg/core.
// registerRoute(
//   /^https:\/\/unpkg\.com\/@ffmpeg\/core/,
//   new CacheFirst({
//     cacheName: "ffmpeg-core",
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new ExpirationPlugin({
//         maxAgeSeconds: 60 * 60 * 24 * 365,
//         maxEntries: 30,
//       }),
//     ],
//   }),
// )
