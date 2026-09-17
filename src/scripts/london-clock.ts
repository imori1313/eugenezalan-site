const clocks = document.querySelectorAll<HTMLElement>('[data-london-clock]');
if (clocks.length) {
  // A named time zone handles both GMT and BST, wherever the visitor is located.
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  const update = () => {
    const now = new Date();
    const parts = Object.fromEntries(formatter.formatToParts(now).map(part => [part.type, part.value]));
    const hours = Number(parts.hour), minutes = Number(parts.minute), seconds = Number(parts.second);
    clocks.forEach(clock => {
      clock.querySelector('.clock-hour')?.setAttribute('transform', `rotate(${hours % 12 * 30 + minutes / 2} 20 20)`);
      clock.querySelector('.clock-minute')?.setAttribute('transform', `rotate(${minutes * 6 + seconds / 10} 20 20)`);
      const time = clock.querySelector('time');
      if (time) {
        time.textContent = `${parts.hour}:${parts.minute}`;
        time.dateTime = now.toISOString();
        time.setAttribute('aria-label', `London time ${parts.hour}:${parts.minute}`);
      }
      clock.classList.add('is-ready');
    });
  };
  update();
  window.setInterval(() => { if (!document.hidden) update(); }, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
}
