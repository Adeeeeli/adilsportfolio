(function () {
  'use strict';

  function isMobileTouchUI() {
    return window.matchMedia('(pointer: coarse), (hover: none)').matches ||
      /iPhone|iPod|iPad|Android/i.test(navigator.userAgent);
  }

  function ensureMobileViewport() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    var content = meta.getAttribute('content') || '';
    if (/interactive-widget/i.test(content)) return;
    meta.setAttribute(
      'content',
      content + (content ? ', ' : '') + 'interactive-widget=resizes-content'
    );
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

    const history = [];
    const MAX_CTX = 10;

    function syncChatLayout() {
      const msgs = $log.querySelectorAll('.msg');
      if ($panel) {
        $panel.classList.toggle('has-thread', msgs.length > 1);
      }
    }

    function append(role, text) {
      const el = document.createElement('div');
      el.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
      el.textContent = text;
      $log.appendChild(el);
      if (role === 'user' && $chips) {
        $chips.classList.add('is-hidden');
      }
      syncChatLayout();
      $log.scrollTop = $log.scrollHeight;
    }

    function typing(on) {
      let t = root.querySelector('#projChatTyping');
      if (on) {
        if (!t) {
          t = document.createElement('div');
          t.id = 'projChatTyping';
          t.className = 'msg bot';
          t.textContent = '…';
          $log.appendChild(t);
        }
      } else if (t) {
        t.remove();
      }
      syncChatLayout();
      $log.scrollTop = $log.scrollHeight;
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

      if (window.AdilAnalytics) {
        AdilAnalytics.event('ai_chat_message', {
          project_id: projectId,
          message_length: text.length,
          input_source: source || 'typed'
        });
      } else {
        trackEvent('ai_chat_message', {
          project_id: projectId,
          message_length: text.length,
          input_source: source || 'typed'
        });
      }

      try {
        typing(true);
        const a = await window.portfolioAsk(projectId, text, history);
        typing(false);
        append('bot', a);
        history.push({ role: 'bot', text: a });
        while (history.length > MAX_CTX) history.shift();
      } catch (err) {
        typing(false);
        append('bot', 'Something went wrong — try again in a moment.');
        console.error(err);
      } finally {
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
