// Kaboul Paris Nord — mise en cache dans le navigateur.
// Photos, polices et icônes : servies depuis le cache (affichage immédiat), puis rafraîchies en arrière-plan.
// Pages, scripts et styles : toujours demandés au serveur d'abord ; le cache ne sert que hors connexion.
const CACHE = 'kpn-1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // avis, Google Maps… : jamais mis en cache

  if (url.pathname.includes('/assets/')) {
    e.respondWith(caches.open(CACHE).then(async cache => {
      const garde = await cache.match(req);
      const frais = fetch(req).then(rep => { if (rep.ok) cache.put(req, rep.clone()); return rep; }).catch(() => garde);
      if (garde) { e.waitUntil(frais); return garde; }
      return frais;
    }));
    return;
  }

  e.respondWith(fetch(req).then(async rep => {
    if (rep.ok) {
      const cache = await caches.open(CACHE);
      // une seule version gardée par fichier (les scripts portent un numéro ?v=…)
      for (const ancien of await cache.keys()) if (new URL(ancien.url).pathname === url.pathname) cache.delete(ancien);
      cache.put(req, rep.clone());
    }
    return rep;
  }).catch(async () => (await caches.match(req)) || (await caches.match(req, { ignoreSearch: true })) || Response.error()));
});
