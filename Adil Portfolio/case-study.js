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

  function initScrollProgress() {
    if (!document.documentElement.classList.contains('case-study')) return;

    var bar = document.getElementById('caseStudyProgress') ||
      document.getElementById('prog') ||
      document.querySelector('.case-study-progress');

    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'caseStudyProgress';
      document.body.insertBefore(bar, document.body.firstChild);
    }

    bar.classList.add('case-study-progress');
    bar.setAttribute('role', 'presentation');
    bar.setAttribute('aria-hidden', 'true');

    function onScroll() {
      var root = document.documentElement;
      var max = root.scrollHeight - root.clientHeight;
      var ratio = max > 0 ? root.scrollTop / max : 0;
      bar.style.width = (Math.min(1, Math.max(0, ratio)) * 100) + '%';
    }

    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollProgress);
  } else {
    initScrollProgress();
  }
})();
