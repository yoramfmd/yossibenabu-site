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
