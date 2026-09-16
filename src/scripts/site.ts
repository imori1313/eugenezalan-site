import './name-sparks';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const closeMenu = () => menu?.close();
menuToggle?.addEventListener('click', () => { menu?.showModal(); menuToggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('scroll-locked'); });
document.querySelector('.menu-close')?.addEventListener('click', closeMenu);
menu?.addEventListener('close', () => { document.body.classList.remove('scroll-locked'); menuToggle?.setAttribute('aria-expanded', 'false'); menuToggle?.focus(); });
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

document.querySelectorAll<HTMLVideoElement>('[data-responsive-video]').forEach(video => {
  const mobileVideo = matchMedia('(max-width: 767px)');
  video.muted = true;
  const hero = video.closest<HTMLElement>('.hero-split');
  let creditStart = Infinity;
  const syncCredits = (time = video.currentTime) => {
    hero?.classList.toggle('is-credit-sequence', Number.isFinite(creditStart) && time >= creditStart);
  };
  // Use the displayed frame's timestamp: pauses, seeking and loop restarts
  // must never drift from the titles embedded in the film.
  if ('requestVideoFrameCallback' in video) {
    const onFrame: VideoFrameRequestCallback = (_now, metadata) => {
      syncCredits(metadata.mediaTime);
      video.requestVideoFrameCallback(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
  }
  for (const event of ['loadedmetadata', 'timeupdate', 'seeking', 'seeked', 'play', 'pause', 'emptied']) {
    video.addEventListener(event, () => syncCredits());
  }
  syncCredits();
  const button = video.closest('[data-film]')?.querySelector<HTMLButtonElement>('[data-video-toggle]');
  const sync = () => { if (!button) return; button.setAttribute('aria-label', video.paused ? 'Play film' : 'Pause film'); button.querySelector('[data-video-label]')!.textContent = video.paused ? 'Play' : 'Pause'; button.querySelector('[data-video-icon]')!.textContent = video.paused ? '▷' : 'Ⅱ'; };
  video.addEventListener('play', sync); video.addEventListener('pause', sync);
  button?.addEventListener('click', () => { if (video.paused) void video.play().catch(sync); else video.pause(); });
  const sound = video.closest('[data-film]')?.querySelector<HTMLButtonElement>('[data-sound-toggle]');
  const volumeSlider = video.closest('[data-film]')?.querySelector<HTMLInputElement>('[data-volume-slider]');
  const volumeValue = video.closest('[data-film]')?.querySelector<HTMLOutputElement>('[data-volume-value]');
  let lastAudibleVolume = video.volume || 1;
  const syncSound = () => {
    const audible = !video.muted && video.volume > 0;
    const percent = Math.round((video.muted ? 0 : video.volume) * 100);
    if (video.volume > 0) lastAudibleVolume = video.volume;
    if (volumeSlider) { volumeSlider.value = String(percent); volumeSlider.setAttribute('aria-valuetext', `${percent}%`); }
    if (volumeValue) volumeValue.value = `${percent}%`;
    sound?.classList.toggle('is-audible', audible);
    sound?.setAttribute('aria-pressed', String(audible));
    sound?.setAttribute('aria-label', audible ? 'Turn sound off' : 'Turn sound on');
    const label = sound?.querySelector('[data-sound-label]'); if (label) label.textContent = audible ? 'Sound on' : 'Sound off';
  };
  sound?.addEventListener('click', () => {
    const enable = video.muted || video.volume === 0;
    video.muted = !enable;
    if (enable) { video.volume = lastAudibleVolume; void video.play().catch(sync); }
    syncSound();
  });
  volumeSlider?.addEventListener('input', () => {
    video.volume = Number(volumeSlider.value) / 100;
    video.muted = video.volume === 0;
    syncSound();
  });
  video.addEventListener('volumechange', syncSound); syncSound();
  const selectFilm = () => {
    const mobile = mobileVideo.matches;
    creditStart = Number(mobile ? video.dataset.mobileCreditStart : video.dataset.creditStart);
    video.poster = (mobile ? video.dataset.mobilePoster : video.dataset.desktopPoster) || '';
    video.src = (mobile ? video.dataset.mobile : video.dataset.desktop) || '';
    hero?.classList.remove('is-credit-sequence');
    video.load();
    void video.play().catch(sync);
  };
  mobileVideo.addEventListener('change', selectFilm);
  selectFilm();
});
document.querySelectorAll<HTMLButtonElement>('[data-secondary-video-toggle]').forEach(button => {
  const video = button.parentElement?.querySelector('video'); if (!video) return;
  const sync = () => { button.textContent = video.paused ? '▷' : 'Ⅱ'; button.setAttribute('aria-label', video.paused ? 'Play detail film' : 'Pause detail film'); };
  button.addEventListener('click', () => { if (video.paused) void video.play().catch(sync); else video.pause(); });
  video.addEventListener('play', sync); video.addEventListener('pause', sync);
  video.muted = true; void video.play().catch(sync);
});
document.querySelectorAll<HTMLElement>('[data-roll]').forEach(el => {
  const label = el.textContent || ''; el.setAttribute('aria-label', label);
  const content = document.createDocumentFragment(); let letterIndex = 0;
  label.split(' ').forEach((word, wordIndex) => {
    if (wordIndex) content.append(document.createTextNode(' '));
    const window = document.createElement('span'); window.className = 'roll-window'; window.setAttribute('aria-hidden', 'true');
    Array.from(word).forEach(letter => { const span = document.createElement('span'); span.className = 'roll-char'; span.style.setProperty('--letter-i', String(letterIndex++)); span.textContent = letter; window.append(span); });
    content.append(window);
  });
  el.replaceChildren(content);
});
if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed', 'motion-entered'); entry.target.classList.remove('image-wait'); observer.unobserve(entry.target);
  }), { threshold: .08 });
  document.querySelectorAll<HTMLElement>('[data-motion-text], [data-reveal], [data-image-reveal]').forEach(el => {
    if (el.hasAttribute('data-motion-text')) el.classList.add('motion-ready');
    if (el.hasAttribute('data-reveal') && el.getBoundingClientRect().top > innerHeight) el.classList.add('will-reveal');
    // Observe the full image box. Clipping it before observing can prevent
    // IntersectionObserver from ever reaching its visibility threshold.
    observer.observe(el);
  });
}
document.querySelectorAll<HTMLElement>('[data-commission-row]').forEach(row => {
  row.addEventListener('pointermove', e => { const box = row.getBoundingClientRect(); row.style.setProperty('--hover-x', `${e.clientX - box.left}px`); row.style.setProperty('--hover-y', `${e.clientY - box.top}px`); });
  const trigger = row.querySelector('button');
  trigger?.addEventListener('click', () => { const open = row.classList.toggle('is-expanded'); trigger.setAttribute('aria-expanded', String(open)); });
});
const processDesktop = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
const syncProcessFocus = () => document.querySelectorAll<HTMLElement>('.original-process-grid .process-image').forEach(image => {
  if (processDesktop.matches) image.tabIndex = 0;
  else image.removeAttribute('tabindex');
});
processDesktop.addEventListener('change', syncProcessFocus);
syncProcessFocus();

const about = document.querySelector<HTMLElement>('[data-scroll-about]');
if (about) {
  const words = [...about.querySelectorAll('.scroll-word')];
  const stage = about.querySelector<HTMLElement>('.scroll-about-stage')!;
  const copy = about.querySelector<HTMLElement>('.scroll-about-words')!;
  const portrait = about.querySelector<HTMLElement>('.scroll-about-portrait')!;
  let queued = false;
  const update = () => {
    queued = false; const rect = about.getBoundingClientRect();
    const height = stage.clientHeight;
    const travel = Math.max(1, rect.height - height);
    // Finish before the sticky stage releases, leaving a short hold at the peak.
    const progress = Math.max(0, Math.min(1, (height * .15 - rect.top) / (travel * .85 + height * .15)));
    words.forEach((word, i) => word.classList.toggle('lit', reduced || i / words.length < progress));
    if (!reduced) {
      const eased = progress * progress * (3 - 2 * progress);
      const space = Math.max(0, height - copy.offsetHeight);
      const textStart = Math.max(24, space * .12);
      const textEnd = Math.max(textStart, space * .55);
      const portraitStart = height * .55;
      const portraitEnd = (height - portrait.offsetHeight) / 2;
      about.style.setProperty('--about-words-y', `${textStart + (textEnd - textStart) * eased}px`);
      about.style.setProperty('--about-portrait-y', `${portraitStart + (portraitEnd - portraitStart) * eased}px`);
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue);
  document.fonts.ready.then(queue);
  update();
}
document.querySelectorAll('[data-feature-viewer]').forEach(viewer => {
  const slides = [...viewer.querySelectorAll<HTMLElement>('[data-feature-slide]')];
  const buttons = [...viewer.querySelectorAll<HTMLButtonElement>('[data-feature-button]')];
  buttons.forEach((button, selected) => button.addEventListener('click', () => {
    slides.forEach((slide, i) => { slide.classList.toggle('is-selected', i === selected); slide.setAttribute('aria-hidden', String(i !== selected)); slide.tabIndex = i === selected ? 0 : -1; });
    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === selected)));
  }));
});
document.querySelectorAll('.moving-collection').forEach(strip => {
  const button = strip.querySelector<HTMLButtonElement>('.strip-toggle');
  button?.addEventListener('click', () => { const paused = strip.classList.toggle('paused'); button.textContent = paused ? 'Play ▷' : 'Pause Ⅱ'; button.setAttribute('aria-label', paused ? 'Play moving collection' : 'Pause moving collection'); });
});
document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(gallery => {
  const items = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-index]')];
  const track = gallery.querySelector<HTMLElement>('.gallery-track')!;
  const dialog = gallery.querySelector<HTMLDialogElement>('dialog')!;
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const viewport = dialog.querySelector<HTMLElement>('.lightbox-viewport')!;
  const zoom = dialog.querySelector<HTMLButtonElement>('.lightbox-zoom')!;
  const error = dialog.querySelector<HTMLElement>('[data-lightbox-error]')!;
  let current = 0; let origin: HTMLButtonElement | undefined;
  const resetZoom = () => { viewport.classList.remove('is-zoomed'); zoom.setAttribute('aria-pressed', 'false'); zoom.textContent = 'Zoom in +'; viewport.scrollTo(0, 0); };
  const show = (index: number) => {
    current = (index + items.length) % items.length; resetZoom(); error.hidden = true;
    image.alt = items[current].dataset.galleryAlt || ''; image.src = items[current].dataset.gallerySrc || '';
    dialog.querySelector('[data-lightbox-count]')!.textContent = `${current + 1} / ${items.length}`;
    dialog.querySelector('[data-lightbox-caption]')!.textContent = image.alt;
    if (!reduced) image.animate([{ opacity: .25, transform: 'scale(.99)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 280 });
  };
  image.addEventListener('error', () => { error.hidden = false; });
  items.forEach((item, i) => item.addEventListener('click', () => { origin = item; show(i); dialog.showModal(); document.body.classList.add('scroll-locked'); }));
  dialog.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('scroll-locked'); origin?.focus({ preventScroll: true }); });
  dialog.querySelector('.lightbox-prev')?.addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lightbox-next')?.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(current + (e.key === 'ArrowRight' ? 1 : -1)); } });
  zoom.addEventListener('click', () => { const expanded = viewport.classList.toggle('is-zoomed'); zoom.setAttribute('aria-pressed', String(expanded)); zoom.textContent = expanded ? 'Zoom out −' : 'Zoom in +'; });
  let startX = 0, startY = 0;
  viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
  viewport.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX; const dy = e.changedTouches[0].clientY - startY; if (!viewport.classList.contains('is-zoomed') && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1)); }, { passive: true });
  const nearest = () => items.reduce((best, item, i) => Math.abs(item.offsetLeft - items[0].offsetLeft - track.scrollLeft) < Math.abs(items[best].offsetLeft - items[0].offsetLeft - track.scrollLeft) ? i : best, 0);
  const move = (step: number) => { const index = Math.max(0, Math.min(items.length - 1, nearest() + step)); track.scrollTo({ left: items[index].offsetLeft - items[0].offsetLeft, behavior: reduced ? 'instant' : 'smooth' }); };
  gallery.querySelectorAll('.gallery-prev').forEach(b => b.addEventListener('click', () => move(-1)));
  gallery.querySelectorAll('.gallery-next').forEach(b => b.addEventListener('click', () => move(1)));
  const syncTrack = () => {
    gallery.querySelector('[data-gallery-counter]')!.textContent = String(nearest() + 1).padStart(2, '0');
    gallery.querySelectorAll<HTMLButtonElement>('.gallery-prev').forEach(b => b.disabled = track.scrollLeft < 4);
    gallery.querySelectorAll<HTMLButtonElement>('.gallery-next').forEach(b => b.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4);
  };
  track.addEventListener('scroll', syncTrack, { passive: true }); addEventListener('resize', syncTrack); syncTrack();
  track.addEventListener('keydown', e => { if (e.target === track && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } });
});
const form = document.querySelector<HTMLFormElement>('[data-enquiry-form]');
if (form) {
  const select = form.querySelector<HTMLSelectElement>('[name=piece]')!;
  const piece = new URLSearchParams(location.search).get('piece');
  if (piece && [...select.options].some(option => option.value === piece)) select.value = piece;
  const result = form.querySelector<HTMLElement>('.enquiry-result')!;
  const preview = form.querySelector<HTMLTextAreaElement>('[data-email-preview]')!;
  const link = form.querySelector<HTMLAnchorElement>('[data-email-link]')!;
  const email = link.href.split('?')[0];
  form.addEventListener('submit', e => {
    e.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form); const value = (key: string) => String(data.get(key) || '').trim();
    preview.value = `Hi Eugene,\n\n${value('message')}\n\nName: ${value('name')}\nEmail: ${value('email')}\nLocation: ${value('location') || 'To discuss'}\nPiece / project: ${value('piece') || 'A bespoke idea'}\nBudget: ${value('budget')}\nPreferred timing: ${value('timeline') || 'To discuss'}`;
    link.href = `${email}?subject=${encodeURIComponent('Furniture commission enquiry' + (value('piece') ? ` — ${value('piece')}` : ''))}&body=${encodeURIComponent(preview.value)}`;
    result.hidden = false; result.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
    form.querySelector('.copy-status')!.textContent = '';
  });
  form.querySelector('[data-copy-enquiry]')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(preview.value); form.querySelector('.copy-status')!.textContent = 'Copied. Paste this into your email and send it to Eugene.'; }
    catch { preview.focus(); preview.select(); form.querySelector('.copy-status')!.textContent = 'Select and copy the message below.'; }
  });
}
