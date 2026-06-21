(function () {
  if (/[?&]embed=1/.test(location.search)) {
    document.documentElement.setAttribute('data-embed', '');
  }

  var isEmbed = document.documentElement.hasAttribute('data-embed');

  function loadAnalytics(cb) {
    if (window.AdilAnalytics) {
      if (cb) cb();
      return;
    }
    var cs = document.currentScript;
    if (!cs || !cs.src) return;
    var url = cs.src.replace(/case-study\.js(\?.*)?$/, 'analytics.js');
    var s = document.createElement('script');
    s.src = url;
    s.onload = function () { if (cb) cb(); };
    document.head.appendChild(s);
  }

  function trackCaseStudy() {
    if (!window.AdilAnalytics) return;
    if (isEmbed || AdilAnalytics.isEmbedded()) {
      AdilAnalytics.event('case_study_embed_view', {
        page_path: location.pathname,
        page_title: document.title
      });
      return;
    }
    AdilAnalytics.initStandalone({
      contentGroup: 'case_study',
      pagePath: location.pathname
    });
  }

  loadAnalytics(function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackCaseStudy);
    } else {
      trackCaseStudy();
    }
  });

  var SEL =
    '.navigation-wrap,.menu,.w-nav,.w-nav-menu,.w-nav-overlay,.w-nav-button,footer.footer-dark,#footer';

  function strip() {
    document.querySelectorAll(SEL).forEach(function (el) {
      el.remove();
    });
  }

  strip();
  document.addEventListener('DOMContentLoaded', strip);

  var obs = new MutationObserver(strip);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', strip);
  setTimeout(function () {
    obs.disconnect();
    strip();
  }, 8000);
})();
