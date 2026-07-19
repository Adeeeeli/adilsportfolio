(function () {
  'use strict';

  function isMobileTouchUI() {
    return window.matchMedia('(pointer: coarse), (hover: none)').matches ||
      /iPhone|iPod|iPad|Android/i.test(navigator.userAgent);
  }

  function isEmbedCaseStudy() {
    return document.documentElement.hasAttribute('data-embed');
  }

  function ensureMobileViewport() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    var content = meta.getAttribute('content') || '';
    var parts = content.split(',').map(function (p) { return p.trim(); }).filter(Boolean);
    var hasWidget = parts.some(function (p) { return /^interactive-widget=/i.test(p); });

    if (!hasWidget) {
      parts.push('interactive-widget=resizes-content');
    }

    /* Resize layout viewport with keyboard so fixed chat stays above it in drawer iframes */
    if (isMobileTouchUI() && isEmbedCaseStudy()) {
      parts = parts.filter(function (p) {
        return !/^interactive-widget=/i.test(p);
      });
      parts.push('interactive-widget=resizes-content');
    }

    meta.setAttribute('content', parts.join(', '));
  }

  function setupMobileKeyboardLayout(root, $input) {
    if (!isMobileTouchUI() || !$input) return;

    function pinToVisualViewport() {
      var vv = window.visualViewport;
      if (!vv) return;

      var gap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      var bottomPad = isEmbedCaseStudy() ? 8 : 16;
      root.style.bottom = (gap + bottomPad) + 'px';
      root.style.setProperty('--chat-vv-h', Math.round(vv.height) + 'px');

      var panelMax = Math.min(Math.round(vv.height) - 24, 420);
      var logMax = Math.min(Math.round(vv.height) - 200, 280);
      root.style.setProperty('--chat-panel-max-h', Math.max(panelMax, 180) + 'px');
      root.style.setProperty('--chat-log-max-h', Math.max(logMax, 72) + 'px');
    }

    function onKeyboardOpen() {
      root.classList.add('is-keyboard-open');
      document.documentElement.classList.add('is-chat-typing');
      pinToVisualViewport();
      window.setTimeout(pinToVisualViewport, 60);
      window.setTimeout(pinToVisualViewport, 180);
      window.setTimeout(pinToVisualViewport, 320);
    }

    function onKeyboardClose() {
      root.classList.remove('is-keyboard-open');
      document.documentElement.classList.remove('is-chat-typing');
      root.style.bottom = '';
      root.style.removeProperty('--chat-vv-h');
      root.style.removeProperty('--chat-panel-max-h');
      root.style.removeProperty('--chat-log-max-h');
    }

    $input.addEventListener('focus', onKeyboardOpen);
    $input.addEventListener('blur', function () {
      window.setTimeout(function () {
        if (document.activeElement === $input) return;
        onKeyboardClose();
      }, 120);
    });

    if (window.visualViewport) {
      var onViewportChange = function () {
        if (root.classList.contains('is-keyboard-open')) pinToVisualViewport();
      };
      window.visualViewport.addEventListener('resize', onViewportChange);
      window.visualViewport.addEventListener('scroll', onViewportChange);
    }
  }

  function trackEvent(name, params, attempt) {
    if (window.AdilAnalytics) {
      AdilAnalytics.event(name, params || {});
      return;
    }
    if ((attempt || 0) < 25) {
      setTimeout(function () {
        trackEvent(name, params, (attempt || 0) + 1);
      }, 120);
    }
  }

  function createFocusGuard($input) {
    function blurInput() {
      if ($input) $input.blur();
    }

    function focusInput() {
      if (!$input || isMobileTouchUI()) return;
      try {
        $input.focus({ preventScroll: true });
      } catch (e) {
        $input.focus();
      }
    }

    return { focusInput: focusInput, blurInput: blurInput };
  }

  function setupFloatUI(root, projectId, focusGuard) {
    const fab = root.querySelector('.proj-chat-fab');
    const panel = root.querySelector('.proj-chat-panel');
    const closeBtn = root.querySelector('.proj-chat-panel-close');
    if (!fab || !panel) return;

    function open() {
      root.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      trackEvent('ai_chat_panel_open', { project_id: projectId || '' });
      if (focusGuard) focusGuard.blurInput();
      if (!isMobileTouchUI()) {
        window.setTimeout(function () {
          if (focusGuard) focusGuard.focusInput();
        }, 280);
      }
    }

    function close() {
      root.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      trackEvent('ai_chat_panel_close', { project_id: projectId || '' });
      if (focusGuard) focusGuard.blurInput();
    }

    function toggle() {
      if (root.classList.contains('is-open')) close();
      else open();
    }

    fab.addEventListener('click', function () {
      if (focusGuard) focusGuard.blurInput();
      toggle();
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (focusGuard) focusGuard.blurInput();
        close();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        close();
        fab.focus();
      }
    });
  }

  function bindChipHandlers(root, $input, submit, focusGuard) {
    root.querySelectorAll('.proj-chat-chip').forEach(function (chip) {
      var chipQuery = function () {
        return chip.dataset.q || chip.textContent;
      };

      var handleChipActivate = function () {
        if (focusGuard) focusGuard.blurInput();
        else if ($input) $input.blur();
        submit(chipQuery(), 'chip');
      };

      if (isMobileTouchUI()) {
        chip.addEventListener('touchend', function (e) {
          e.preventDefault();
          handleChipActivate();
        }, { passive: false });

        chip.addEventListener('click', function (e) {
          e.preventDefault();
        });
      } else {
        chip.addEventListener('click', handleChipActivate);
      }
    });
  }

  function initProjectChat(projectId, root) {
    if (!root || !window.portfolioAsk) return;

    const project = window.PORTFOLIO_PROJECTS && window.PORTFOLIO_PROJECTS[projectId];
    if (!project) return;

    const $log = root.querySelector('.proj-chat-log');
    const $form = root.querySelector('.proj-chat-form');
    const $input = root.querySelector('.proj-chat-input');
    const $send = root.querySelector('.proj-chat-send');
    const $panel = root.querySelector('.proj-chat-panel');
    const $chips = root.querySelector('.proj-chat-chips');

    const focusGuard = $input ? createFocusGuard($input) : null;
    setupFloatUI(root, projectId, focusGuard);

    if (!$log || !$form || !$input || !$send) return;

    if (isMobileTouchUI()) {
      $form.setAttribute('novalidate', '');
    }

    (function enhanceChatChrome() {
      var head = root.querySelector('.proj-chat-panel-head');
      var titleEl = root.querySelector('.proj-chat-panel-title');
      if (head && titleEl && !head.querySelector('.proj-chat-brand')) {
        var label = titleEl.textContent.trim() || 'AI assistant';
        var icon = root.querySelector('.proj-chat-fab img.chat-ai-icon');
        var iconSrc = icon ? icon.getAttribute('src') : '';
        var brand = document.createElement('div');
        brand.className = 'proj-chat-brand';
        brand.innerHTML =
          (iconSrc
            ? '<span class="proj-chat-avatar" aria-hidden="true"><img src="' +
              iconSrc +
              '" width="18" height="18" alt=""></span>'
            : '') +
          '<span class="proj-chat-brand-copy">' +
          '<span class="proj-chat-panel-title">' +
          label +
          '</span>' +
          '<span class="proj-chat-status"><span class="proj-chat-status-dot" aria-hidden="true"></span>AI assistant · Online</span>' +
          '</span>';
        titleEl.replaceWith(brand);
      }
      if (!$input.getAttribute('placeholder') || $input.getAttribute('placeholder') === 'Ask anything…') {
        $input.setAttribute('placeholder', 'Message the AI…');
      }
    })();

    const history = [];
    const MAX_CTX = 10;

    function syncChatLayout() {
      const msgs = $log.querySelectorAll('.msg');
      if ($panel) {
        $panel.classList.toggle('has-thread', msgs.length > 1);
      }
    }

    function append(role, text, opts) {
      const el = document.createElement('div');
      el.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
      if (!opts || opts.animate !== false) el.classList.add('is-enter');
      el.textContent = text;
      $log.appendChild(el);
      if (role === 'user' && $chips) {
        $chips.classList.add('is-hidden');
      }
      syncChatLayout();
      $log.scrollTop = $log.scrollHeight;
      return el;
    }

    function wait(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }

    function nextPaint() {
      return new Promise(function (resolve) {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(resolve);
        });
      });
    }

    function setAssistantStatus(mode) {
      var status = root.querySelector('.proj-chat-status');
      if (!status) return;
      if (mode === 'thinking') {
        status.innerHTML =
          '<span class="proj-chat-status-dot is-busy" aria-hidden="true"></span>Thinking…';
      } else if (mode === 'writing') {
        status.innerHTML =
          '<span class="proj-chat-status-dot is-busy" aria-hidden="true"></span>Writing…';
      } else {
        status.innerHTML =
          '<span class="proj-chat-status-dot" aria-hidden="true"></span>AI assistant · Online';
      }
    }

    function typing(on) {
      let t = root.querySelector('#projChatTyping');
      if (on) {
        if (!t) {
          t = document.createElement('div');
          t.id = 'projChatTyping';
          t.className = 'msg bot typing is-enter';
          t.setAttribute('aria-live', 'polite');
          t.setAttribute('aria-label', 'Assistant is thinking');
          t.innerHTML =
            '<span class="proj-chat-typing-dots" aria-hidden="true">' +
            '<span></span><span></span><span></span>' +
            '</span>' +
            '<span class="proj-chat-typing-label">Thinking</span>';
          $log.appendChild(t);
        }
        setAssistantStatus('thinking');
      } else if (t) {
        t.remove();
      }
      syncChatLayout();
      $log.scrollTop = $log.scrollHeight;
    }

    function typeOut(text) {
      return new Promise(function (resolve) {
        const reduced =
          window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced || !text) {
          append('bot', text || '');
          resolve();
          return;
        }

        setAssistantStatus('writing');
        const el = append('bot', '', { animate: true });
        el.classList.add('is-streaming');
        const full = String(text);
        let i = 0;

        /* Character reveal — readable “AI typing”, not an instant dump */
        function delayFor(ch) {
          if (ch === '\n') return 140;
          if (ch === '.' || ch === '!' || ch === '?') return 110;
          if (ch === ',' || ch === ';' || ch === ':') return 55;
          if (ch === ' ') return 22;
          return 32;
        }

        function chunkSize() {
          if (full.length > 1200) return 3;
          if (full.length > 500) return 2;
          return 1;
        }

        function tick() {
          var n = chunkSize();
          var end = Math.min(full.length, i + n);
          var last = full.charAt(end - 1) || '';
          i = end;
          el.textContent = full.slice(0, i);
          $log.scrollTop = $log.scrollHeight;
          if (i < full.length) {
            window.setTimeout(tick, delayFor(last));
          } else {
            el.classList.remove('is-streaming');
            setAssistantStatus('online');
            resolve();
          }
        }
        tick();
      });
    }

    async function submit(q, source) {
      const text = (q || '').trim();
      if (!text) return;

      if (source === 'chip') {
        focusGuard.blurInput();
      }

      $send.disabled = true;
      append('user', text);
      history.push({ role: 'user', text: text });
      while (history.length > MAX_CTX) history.shift();
      $input.value = '';

      /* GA4 event params max ~100 chars — keep question readable in Explore */
      var questionParam = text.length > 100 ? text.slice(0, 97) + '…' : text;
      var projectName = (project && project.title) || projectId;
      trackEvent('ai_chat_question', {
        project_id: projectId,
        project_name: projectName,
        question: questionParam,
        question_length: text.length,
        input_source: source || 'typed'
      });

      try {
        typing(true);
        /* Force a paint so Thinking dots are visible before the ask resolves */
        await nextPaint();
        var started = Date.now();
        var result = await window.portfolioAsk(projectId, text, history);
        var a = result && typeof result === 'object' ? result.answer : result;
        var answerSource =
          result && typeof result === 'object' && result.source
            ? result.source
            : 'unknown';
        var elapsed = Date.now() - started;
        var minThinkMs = 900;
        if (elapsed < minThinkMs) await wait(minThinkMs - elapsed);
        typing(false);
        trackEvent('ai_chat_reply', {
          project_id: projectId,
          project_name: projectName,
          question: questionParam,
          answer_source: answerSource,
          success: true,
          latency_ms: elapsed
        });
        await typeOut(a);
        history.push({ role: 'bot', text: a });
        while (history.length > MAX_CTX) history.shift();
      } catch (err) {
        typing(false);
        trackEvent('ai_chat_reply', {
          project_id: projectId,
          project_name: projectName,
          question: questionParam,
          answer_source: 'error',
          success: false
        });
        await typeOut('Something went wrong — try again in a moment.');
        console.error(err);
      } finally {
        setAssistantStatus('online');
        $send.disabled = false;
        if (source === 'chip') {
          focusGuard.blurInput();
        } else if (!isMobileTouchUI()) {
          focusGuard.focusInput();
        }
      }
    }

    $form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit($input.value, 'typed');
    });

    $input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        $form.dispatchEvent(new Event('submit'));
      }
    });

    $send.addEventListener('click', function () {
      if (!isMobileTouchUI()) focusGuard.blurInput();
    });

    bindChipHandlers(root, $input, submit, focusGuard);
    setupMobileKeyboardLayout(root, $input);

    trackEvent('ai_chat_ready', { project_id: projectId });

    append('bot', project.greeting || 'Ask me about this project.');
    syncChatLayout();
  }

  window.initProjectChat = initProjectChat;
  window.isMobileTouchUI = isMobileTouchUI;

  document.addEventListener('DOMContentLoaded', function () {
    ensureMobileViewport();
    document.querySelectorAll('[data-project-chat]').forEach(function (el) {
      initProjectChat(el.getAttribute('data-project-chat'), el);
    });
  });
})();
