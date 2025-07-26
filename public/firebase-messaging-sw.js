self.addEventListener('push', function (event) {
  event.waitUntil(
    (async () => {
      try {
        const rawText = await event.data?.text();
        console.log('[Raw push data]', rawText);

        const parsed = JSON.parse(rawText);
        const payload = parsed.data || {};

        console.log('[ServiceWorker] Push Received with data:', parsed);
        console.log('[data.title] Push Received with data title:', payload.title);

        const title = payload.title || '📬 푸시 알림을 보내드릴게요!';
        const body = payload.content || '튜닝에서 놓치지 말아야 할 소식을 실시간으로 확인해보세요.';

        self.registration.showNotification(title, {
          body,
          icon: 'https://hertz-tuning.com/icons/favicon.png',
          data: {
            url: 'https://hertz-tuning.com',
          },
        });
      } catch (err) {
        console.error('[ServiceWorker] Push 처리 중 오류 발생', err);
      }
    })(),
  );
});
