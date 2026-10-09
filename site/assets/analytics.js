/* Yossi Ben Abu: anonymous portfolio events; never collect inquiry fields. */
(function () {
  'use strict';
  if (window.__websiteAnalytics) return;
  window.__websiteAnalytics = true;
  var config = document.currentScript;
  var id = config && config.getAttribute('data-umami-id');
  var hosts = ['yossibenabu.com', 'www.yossibenabu.com'];
  var params = new URLSearchParams(location.search);
  // Studio-only opt-out works before any tracker is loaded, per browser/device.
  try {
    if (params.get('analytics') === 'off') localStorage.setItem('umami.disabled', '1');
    if (params.get('analytics') === 'on') localStorage.removeItem('umami.disabled');
    if (localStorage.getItem('umami.disabled')) return;
  } catch (e) { if (params.get('analytics') === 'off') return; }
  if (!id || hosts.indexOf(location.hostname) < 0 || navigator.doNotTrack === '1') return;
  var utmKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  function path(value) {
    return value.replace(/^\/yossibenabu-site(?=\/|$)/, '').replace(/\/index\.html$/, '/') || '/';
  }
  function cleanUrl(value, campaign) {
    try {
      var u = new URL(value, location.href);
      var q = new URLSearchParams();
      if (campaign) utmKeys.forEach(function (key) {
        var v = u.searchParams.get(key);
        if (v && !/@|%40/i.test(v)) q.set(key, v.slice(0, 100));
      });
      var own = hosts.indexOf(u.hostname) >= 0;
      return (own ? '' : u.origin) + (own ? path(u.pathname) : u.pathname) + (q.size ? '?' + q.toString() : '');
    } catch (e) { return ''; }
  }
  window.websiteAnalyticsBeforeSend = function (type, payload) {
    try { if (localStorage.getItem('umami.disabled')) return false; } catch (e) {}
    if (payload.url) payload.url = cleanUrl(payload.url, true);
    if (payload.referrer) payload.referrer = cleanUrl(payload.referrer, false);
    payload.tag = 'portfolio-v3';
    return payload;
  };
  var pending = [];
  function track(name, data) {
    data = Object.assign({page: path(location.pathname)}, data || {});
    if (window.umami) {
      try { var result = window.umami.track(name, data); if (result && result.catch) result.catch(function () {}); } catch (e) {}
    } else if (pending.length < 30) pending.push([name, data]);
  }
  var script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', id);
  script.setAttribute('data-domains', hosts.join(','));
  script.setAttribute('data-before-send', 'websiteAnalyticsBeforeSend');
  script.setAttribute('data-exclude-hash', 'true');
  script.setAttribute('data-do-not-track', 'true');
  script.setAttribute('data-tag', 'portfolio-v3');
  script.onload = function () { pending.splice(0).forEach(function (item) { track(item[0], item[1]); }); };
  document.head.appendChild(script);
  var galleries = {'sbfinearts.com':'Stephanie Breitbard Fine Arts','jwilliamsfineart.com':'J Williams Fine Art','ednacontemporary.com':'EDNA Contemporary','julesplace.com':'Jules Place','chandlerartgallery.com':'Chandler Art Gallery'};
  document.addEventListener('click', function (event) {
    var el = event.target && event.target.closest ? event.target : null;
    if (!el) return;
    var a = el.closest('a[href]');
    if (!a) return;
    var u;
    try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { return; }
    var viewer = a.closest('[data-viewer]');
    var artwork = viewer ? viewer.getAttribute('data-artwork-title') || '' : '';
    if (a.hasAttribute('data-view')) {
      track('artwork-view-change', {artwork: artwork, view: a.getAttribute('data-view')}); return;
    }
    if (a.hasAttribute('data-full-image')) { track('artwork-image-open', {artwork: artwork}); return; }
    if (u.protocol === 'mailto:') { track('email-click'); return; }
    if (!/^https?:$/.test(u.protocol)) return;
    var host = u.hostname.replace(/^www\./, '');
    if (galleries[host]) { track('gallery-click', {gallery: galleries[host]}); return; }
    if (hosts.indexOf(u.hostname) >= 0) {
      if (u.hash === '#inquire') { track('inquiry-click'); return; }
      if (/^\/work\//.test(path(u.pathname))) { track('artwork-explore', {artwork_path: path(u.pathname)}); return; }
      if (a.hasAttribute('data-open-document')) { track('artist-document-open', {document: a.getAttribute('data-open-document')}); return; }
    } else { track(host === 'instagram.com' ? 'instagram-click' : 'outbound', {destination: host}); }
  }, true);
  document.addEventListener('submit', function (event) {
    if (event.target.matches && event.target.matches('.studio-form')) track('inquiry-submit-attempt');
    // Never intercept navigation or label an attempt as delivery/success.
  }, true);
})();
