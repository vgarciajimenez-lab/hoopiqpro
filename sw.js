// Permite abrir la app y anotar sin conexión: guarda los archivos en el dispositivo.
var CACHE="basket-20260924d";
var FILES=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-192.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var req=e.request;
  if(req.method!=="GET")return;
  var url=new URL(req.url);
  if(url.origin!==location.origin)return;               // las llamadas a la nube no pasan por aquí
  var net=fetch(req).then(function(res){
    if(res&&res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy);});}
    return res;
  });
  var timeout=new Promise(function(_,rej){setTimeout(function(){rej(new Error("lento"));},4000);});
  e.respondWith(Promise.race([net,timeout]).catch(function(){
    return caches.match(req,{ignoreSearch:true}).then(function(r){return r||caches.match("index.html");});
  }));
});
