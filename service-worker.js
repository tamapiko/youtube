self.addEventListener('install', function(event) {
    console.log('Service Worker installed');
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activated');
});

self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'appicon192.png', // ここで1つのアイコンに統一
        vibrate: [200, 100, 200],
        tag: 'analysis-notification'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
