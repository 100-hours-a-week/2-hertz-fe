self.addEventListener('push', function (event) {
  const data = event.data?.json();
  const { title, body } = data?.notification || {};

  event.waitUntil(
    self.registration.showNotification(title || '📬 푸시 알림을 보내드릴게요!', {
      body: body || '튜닝에서 놓치지 말아야 할 소식을 실시간으로 확인해보세요.',
    }),
  );
});
