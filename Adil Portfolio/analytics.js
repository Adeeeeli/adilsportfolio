(function (global) {
  'use strict';

  var ID = 'G-JL2894MXJN';
  var SOURCE = 'adil-portfolio';
  var embedded = global.top !== global.self;
  var gtagLoaded = false;
  var shellBridge = false;

  global.dataLayer = global.dataLayer || [];
  global.gtag = global.gtag || function () {
    global.dataLayer.push(arguments);
  };

  function isEmbedded() {
    return embedded;
  }

  function loadGtag() {
    if (gtagLoaded || isEmbedded()) return;
    gtagLoaded = true;
    global.gtag('js', new Date());
    global.gtag('config', ID, {
      send_page_view: false,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
      document.head.appendChild(s);
    }
  }

  function postToTop(type, payload) {
    if (!isEmbedded()) return;
    try {
      global.top.postMessage(
        Object.assign({ source: SOURCE, type: type }, payload || {}),
        global.location.origin
      );
    } catch (e) { /* ignore */ }
  }

  function pageView(params) {
    params = params || {};
    var data = {
      page_path: params.page_path || global.location.pathname + global.location.search,
      page_title: params.page_title || document.title,
      page_location: params.page_location || global.location.href
    };
    if (params.content_group) data.content_group = params.content_group;
    if (params.portfolio_mode) data.portfolio_mode = params.portfolio_mode;

    if (isEmbedded()) {
      postToTop('analytics:page_view', data);
      return;
    }
    loadGtag();
    global.gtag('event', 'page_view', data);
  }

  function event(name, params) {
    params = params || {};
    if (isEmbedded()) {
      postToTop('analytics:event', { event_name: name, params: params });
      return;
    }
    loadGtag();
    global.gtag('event', name, params);
  }

  function initShell() {
    loadGtag();
    shellBridge = true;
    global.addEventListener('message', onShellMessage);
  }

  function onShellMessage(e) {
    if (!shellBridge || e.origin !== global.location.origin) return;
    var d = e.data;
    if (!d || d.source !== SOURCE) return;
    if (d.type === 'analytics:page_view') {
      global.gtag('event', 'page_view', {
        page_path: d.page_path,
        page_title: d.page_title,
        page_location: d.page_location,
        content_group: d.content_group,
        portfolio_mode: d.portfolio_mode
      });
    } else if (d.type === 'analytics:event' && d.event_name) {
      global.gtag('event', d.event_name, d.params || {});
    }
  }

  function trackShellRoute(route, title) {
    if (!route) return;
    var path = route === 'Home.html' ? '/' : '/' + route.replace(/^\.\//, '');
    pageView({
      page_path: path,
      page_title: title || document.title,
      page_location: global.location.origin + (global.location.pathname || '/') +
        (route === 'Home.html' ? '' : '#/' + route)
    });
  }

  function initFrame() {
    /* iframe child: events only, shell owns gtag + page views */
  }

  function initStandalone(opts) {
    opts = opts || {};
    if (isEmbedded()) {
      initFrame();
      return;
    }
    loadGtag();
    if (opts.sendPageView !== false) {
      pageView({
        page_path: opts.pagePath,
        page_title: opts.pageTitle,
        content_group: opts.contentGroup
      });
    }
  }

  function setupAutoLinkTracking() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return;

      if (href.indexOf('mailto:') === 0) {
        event('contact_click', {
          link_type: 'email',
          link_url: href.split('?')[0]
        });
      } else if (href.indexOf('tel:') === 0) {
        event('contact_click', {
          link_type: 'phone',
          link_url: href
        });
      } else if (href.indexOf('http') === 0 || href.indexOf('//') === 0) {
        try {
          var url = new URL(href, global.location.href);
          if (url.hostname && url.hostname !== global.location.hostname) {
            event('outbound_click', {
              link_url: url.href,
              link_text: (a.textContent || '').trim().slice(0, 80)
            });
          }
        } catch (err) { /* ignore */ }
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoLinkTracking);
  } else {
    setupAutoLinkTracking();
  }

  global.AdilAnalytics = {
    ID: ID,
    isEmbedded: isEmbedded,
    initShell: initShell,
    initFrame: initFrame,
    initStandalone: initStandalone,
    pageView: pageView,
    event: event,
    trackShellRoute: trackShellRoute
  };
})(window);
