// Cachea solo el "shell" (HTML/CSS/JS de la app). Los datos SIEMPRE van a la red
// para no mostrar información vieja entre dispositivos.
const CACHE = 'qc-aros-shell-v1';
const SHELL = ['./index.html', './manifest.json'];
 
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(SHELL)));
  self.skipWaiting();
});
 
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
 
self.addEventListener('fetch', e=>{
  const url = e.request.url;
  // Nunca cachear llamadas al backend (Apps Script): siempre red, siempre datos frescos
  if(url.includes('script.google.com')){ return; }
  e.respondWith(
    fetch(e.request).then(res=>{
      const clone = res.clone();
      caches.open(CACHE).then(c=> c.put(e.request, clone));
      return res;
    }).catch(()=> caches.match(e.request))
  );
});