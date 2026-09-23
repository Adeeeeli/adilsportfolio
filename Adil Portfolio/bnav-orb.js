/**
 * Iconsax AI–style liquid orb hover for bottom nav.
 * Color blobs bloom under .nb on hover only — active keeps chrome lm-ring.
 */
(function () {
  'use strict';

  var STYLE_ID = 'bnav-orb-style';
  var COLORS = [
    { cls: 'c1', bg: '#02DEFC', t: 'translate(-73%, -65%)' },
    { cls: 'c2', bg: '#7FFE00', t: 'translate(-20%, 63%)' },
    { cls: 'c3', bg: '#FDF301', t: 'translate(-86%, -66%)' },
    { cls: 'c4', bg: '#F66315', t: 'translate(87%, 40%)' },
    { cls: 'c5', bg: '#FC0197', t: 'translate(-71%, 91%)' },
    { cls: 'c6', bg: '#FE9EFB', t: 'translate(-23%, 13%)' }
  ];

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      '.nb{overflow:hidden}',
      '.nb-orb{position:absolute;inset:0;border-radius:999px;overflow:hidden;pointer-events:none;z-index:0}',
      '.nb-orb-blobs{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;',
      'border-radius:999px;opacity:0;transform:scale(2.6);',
      'transition:opacity .45s ease,transform .5s cubic-bezier(.22,1,.36,1)}',
      /* Hover only — never on .lm-active / .contact-on */
      '.nb:hover .nb-orb-blobs{opacity:1;transform:scale(1)}',
      '.nb-blob{position:absolute;width:28px;height:28px;border-radius:50%;filter:blur(7px);',
      'transition:transform 2s ease;will-change:transform}',
      '.nb-blob.c1{background:#02DEFC}',
      '.nb-blob.c2{background:#7FFE00}',
      '.nb-blob.c3{background:#FDF301}',
      '.nb-blob.c4{background:#F66315}',
      '.nb-blob.c5{background:#FC0197}',
      '.nb-blob.c6{background:#FE9EFB}',
      '.nb > svg{position:relative;z-index:2}',
      '.nb:hover{background:rgba(0,0,0,.35)!important;color:#fff}',
      '.nb:hover > svg{filter:drop-shadow(0 0 6px rgba(0,0,0,.45))}',
      '@media (prefers-reduced-motion:reduce){',
      '.nb-orb-blobs{transition:opacity .2s ease}',
      '.nb-blob{transition:none}}'
    ].join('');
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function orbMarkup() {
    var blobs = COLORS.map(function (c) {
      return '<i class="nb-blob ' + c.cls + '" style="transform:' + c.t + '"></i>';
    }).join('');
    return '<span class="nb-orb" aria-hidden="true"><span class="nb-orb-blobs">' + blobs + '</span></span>';
  }

  function randTranslate() {
    var x = Math.round((Math.random() * 180 - 90));
    var y = Math.round((Math.random() * 180 - 90));
    return 'translate(' + x + '%,' + y + '%)';
  }

  function scramble(root) {
    root.querySelectorAll('.nb-blob').forEach(function (b) {
      b.style.transform = randTranslate();
    });
  }

  function initBottomNavOrbs(bnav) {
    bnav = bnav || document.getElementById('bnav') || document.querySelector('.bnav');
    if (!bnav || bnav.dataset.orbReady === '1') return;
    bnav.dataset.orbReady = '1';
    ensureStyle();

    bnav.querySelectorAll('.nb').forEach(function (btn) {
      if (btn.querySelector('.nb-orb')) return;
      btn.insertAdjacentHTML('afterbegin', orbMarkup());
    });

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Drift only while hovering
    var timer = window.setInterval(function () {
      if (document.hidden) return;
      bnav.querySelectorAll('.nb:hover').forEach(scramble);
    }, 2200);

    bnav.addEventListener('mouseenter', function (e) {
      var btn = e.target.closest && e.target.closest('.nb');
      if (btn) scramble(btn);
    }, true);

    bnav._orbTimer = timer;
  }

  window.initBottomNavOrbs = initBottomNavOrbs;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initBottomNavOrbs(); });
  } else {
    initBottomNavOrbs();
  }
})();
