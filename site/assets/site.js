// Each artwork owns its view controls; ordinary links remain usable without JS.
document.querySelectorAll('[data-viewer]').forEach(viewer => {
  const image = viewer.querySelector('[data-main-image]');
  const caption = viewer.querySelector('[data-view-caption]');
  const full = viewer.querySelector('[data-full-image]');
  const links = viewer.querySelectorAll('[data-view]');
  const title = viewer.dataset.artworkTitle || image?.alt || 'Artwork';
  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    image.src = link.href;
    image.removeAttribute('srcset');
    image.alt = `${title} · ${link.dataset.view}`;
    if (caption) caption.textContent = `${title} · ${link.dataset.view}`;
    if (full) full.href = link.href;
    links.forEach(item => item.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'true');
  }));
});

// Room images share one fixed frame; automatic rotation never moves the layout.
document.querySelectorAll('[data-space-gallery]').forEach(gallery => {
  const slides = [...gallery.querySelectorAll('.space-slide')];
  const caption = gallery.querySelector('[data-space-caption]');
  const count = gallery.querySelector('[data-space-count]');
  const pause = gallery.querySelector('[data-space-pause]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = motion.matches, visible = false, hovered = false, timer;
  const updateTimer = () => {
    clearInterval(timer);
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Start image rotation' : 'Pause image rotation');
    count.setAttribute('aria-live', paused ? 'polite' : 'off');
    if (!paused && visible && !hovered && !document.hidden) timer = setInterval(() => show(index + 1), 6000);
  };
  const show = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
    });
    caption.textContent = slides[index].dataset.title;
    count.textContent = `${index + 1} / ${slides.length}`;
  };
  gallery.querySelector('.space-controls').hidden = false;
  gallery.querySelector('[data-space-prev]').addEventListener('click', () => { paused = true; show(index - 1); updateTimer(); });
  gallery.querySelector('[data-space-next]').addEventListener('click', () => { paused = true; show(index + 1); updateTimer(); });
  pause.addEventListener('click', () => { paused = !paused; updateTimer(); });
  gallery.addEventListener('mouseenter', () => { hovered = true; updateTimer(); });
  gallery.addEventListener('mouseleave', () => { hovered = false; updateTimer(); });
  gallery.addEventListener('focusin', () => { paused = true; updateTimer(); });
  document.addEventListener('visibilitychange', updateTimer);
  motion.addEventListener('change', () => { paused = motion.matches; updateTimer(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateTimer(); }, { threshold: 0.25 }).observe(gallery);
  updateTimer();
});
