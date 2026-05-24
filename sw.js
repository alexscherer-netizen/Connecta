self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// Handle messages from main app (tab active)
self.addEventListener('message', e => {
  if (e.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon } = e.data;
    e.waitUntil(
      self.registration.showNotification(title, {
        body, tag: tag || 'connecta', icon: icon || './favicon.ico',
        vibrate: [200, 100, 200], renotify: true
      })
    );
  }
});

// Handle server push (screen off / tab closed)
self.addEventListener('push', e => {
  let data = { title: 'Connecta', body: 'Neue Nachricht', tag: 'connecta' };
  try { data = e.data.json(); } catch(err) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'Connecta', {
      body: data.body || 'Neue Nachricht',
      tag: data.tag || 'connecta',
      icon: './favicon.ico',
      vibrate: [200, 100, 200],
      renotify: true,
      badge: './favicon.ico'
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
