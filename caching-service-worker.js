/*

Source: https://github.com/nodexpertsdev/service-worker-cache-example

MIT License

Copyright (c) 2017 NodeXperts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var version = 'Grove II Cache v1',
    filesToCache = [
      // HTML
      './index.html',

      // JS
      './caching-service-worker.js',
      './fileSaver.js',
      './log.js'
    ];

console.debug('Service worker cache version is ', version)

self.addEventListener('install', function (event) {
  console.debug("Installing service worker");
  // event.waitUntil will stop the flow till the Promise is resolved
  event.waitUntil(
    // opens cache
    // cache is an object which is available inside service-worker
    caches.open(version).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.debug("Activating service worker");
  event.waitUntil(
   caches.keys().then(function(cachedFiles) {
     return Promise.all(cachedFiles.map(function(cacheFile) {
       // everytime a cache version changes, old files are removed from cache
       if (cacheFile !== version) {
         console.debug('Removing Cached Files from Cache - ', cacheFile);
         return caches.delete(cacheFile);
       }
     }));
   })
 );
});


self.addEventListener('fetch', function (event) {
  console.debug("Fetching from service worker");
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
