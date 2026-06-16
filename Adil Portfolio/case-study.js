(function () {
  if (/[?&]embed=1/.test(location.search)) {
    document.documentElement.setAttribute('data-embed', '');
  }

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
