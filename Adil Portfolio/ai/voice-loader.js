/**
 * Loads voice/context markdown for LLM requests (and caches for engine.js).
 * Paths are relative to the case study page (same folder as Home.html / DesignLab.html).
 */
(function () {
  'use strict';

  var VOICE_FILES = [
    './Adil Portfolio/ai/context/who-is-adil.md',
    './Adil Portfolio/ai/context/how-adil-speaks.md',
    './Adil Portfolio/ai/context/voice-instructions.md'
  ];

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) return '';
      return res.text();
    }).catch(function () {
      return '';
    });
  }

  window.PORTFOLIO_VOICE_CONTEXT = '';
  window.PORTFOLIO_VOICE_READY = Promise.all(VOICE_FILES.map(fetchText)).then(function (parts) {
    window.PORTFOLIO_VOICE_CONTEXT = parts.filter(Boolean).join('\n\n---\n\n');
    return window.PORTFOLIO_VOICE_CONTEXT;
  });
})();
