/* LEX Waypoint analytics (GA4). Waypoint is its own site on lexwaypoint.com.au with its own
   GA4 property, separate from avocadodigital.com.au. The property's measurement ID is below;
   with no ID this file does nothing. */
(function () {
  var MEASUREMENT_ID = 'G-XBE4DE6DCQ';
  if (!MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  var path = location.pathname;
  if (/book-my-demo\/thanks/.test(path)) gtag('event', 'generate_lead', { form: 'waypoint-demo' });
  else if (/book-a-call\/thanks/.test(path)) gtag('event', 'generate_lead', { form: 'waypoint-call' });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.btn');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var name = /\/app\/?/.test(href) ? (/tour=1/.test(href) ? 'tour_start' : 'console_open') : 'cta_click';
    gtag('event', name, { link_url: href, link_text: (a.textContent || '').trim().slice(0, 60) });
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.name) gtag('event', 'form_submit', { form: f.name });
  }, true);

  document.addEventListener('play', function (e) {
    var v = e.target;
    if (!v || v.tagName !== 'VIDEO' || v.__tracked) return;
    v.__tracked = true;
    gtag('event', 'video_play', { video: (v.getAttribute('poster') || '').replace(/^.*\//, '').replace(/\.\w+$/, '') });
  }, true);
})();
