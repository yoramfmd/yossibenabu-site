// Three-hour time buckets choose a frontal from the artist-approved catalog.
// Selection happens once on page load. The image never changes during a visit.
(() => {
  const cards = [...document.querySelectorAll('[data-curated-work]')];
  if (!cards.length || cards.length % 3 !== 0 || cards.some(card => card.dataset.approved !== 'true')) return;
  const hero = document.querySelector('.hero [data-viewer]');
  if (!hero) return;
  const selected = cards[Math.floor(Date.now() / (3 * 60 * 60 * 1000)) % cards.length];
  const source = selected.querySelector('[data-main-image]');
  const target = hero.querySelector('[data-main-image]');
  const title = selected.dataset.artworkTitle;
  hero.dataset.artworkTitle = title;
  target.src = source.src;
  target.alt = source.alt;
  target.removeAttribute('srcset');
  target.width = source.width;
  target.height = source.height;
  hero.querySelector('[data-view-caption]').textContent = `${title} · ${selected.dataset.mainLabel || "Frontal"}`;
  hero.querySelector('[data-full-image]').href = source.src;
  // Clone actual view links; the shared viewer attaches its handlers afterward.
  const controls = hero.querySelector('.view-controls');
  controls.replaceChildren(...[...selected.querySelectorAll('[data-view]')].map(link => link.cloneNode(true)));
  controls.setAttribute('aria-label', `${title} views`);
})();
