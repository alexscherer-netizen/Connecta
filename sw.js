self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
  if (e.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon } = e.data;
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        tag: tag || 'connecta',
        icon: icon || './favicon.ico',
        badge: icon || './favicon.ico',
        vibrate: [200, 100, 200],
        renotify: true,
        requireInteraction: false,
        data: e.data
      })
    );
  }
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
