(function () {
  'use strict';

  function setupFloatUI(root) {
    const fab = root.querySelector('.proj-chat-fab');
    const panel = root.querySelector('.proj-chat-panel');
    const closeBtn = root.querySelector('.proj-chat-panel-close');
    const shell = root.querySelector('.proj-chat-shell');
    const ring = root.querySelector('.proj-chat-lm-ring');
    const $input = root.querySelector('.proj-chat-input');
    if (!fab || !panel) return;

    let lmRing = null;
    if (ring && shell && window.initLiquidMetalRing) {
      lmRing = window.initLiquidMetalRing(ring, fab, shell);
    }

    function refreshRing() {
      if (lmRing && lmRing.refresh) lmRing.refresh();
    }

    function open() {
      root.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      refreshRing();
      window.setTimeout(function () {
        if ($input) $input.focus();
        refreshRing();
      }, 280);
    }

    function close() {
      root.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      refreshRing();
    }

    function toggle() {
      if (root.classList.contains('is-open')) close();
      else open();
    }

    fab.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        close();
        fab.focus();
      }
    });
  }

  function initProjectChat(projectId, root) {
    if (!root || !window.portfolioAsk) return;

    const project = window.PORTFOLIO_PROJECTS && window.PORTFOLIO_PROJECTS[projectId];
    if (!project) return;

    setupFloatUI(root);

    const $log = root.querySelector('.proj-chat-log');
    const $form = root.querySelector('.proj-chat-form');
    const $input = root.querySelector('.proj-chat-input');
    const $send = root.querySelector('.proj-chat-send');
    if (!$log || !$form || !$input || !$send) return;

    const history = [];
    const MAX_CTX = 10;

    function append(role, text) {
      const el = document.createElement('div');
      el.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
      el.textContent = text;
      $log.appendChild(el);
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
      $log.scrollTop = $log.scrollHeight;
    }

    async function submit(q) {
      const text = (q || '').trim();
      if (!text) return;

      $send.disabled = true;
      append('user', text);
      history.push({ role: 'user', text: text });
      while (history.length > MAX_CTX) history.shift();
      $input.value = '';

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
        $input.focus();
      }
    }

    $form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit($input.value);
    });

    $input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        $form.dispatchEvent(new Event('submit'));
      }
    });

    root.querySelectorAll('.proj-chat-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        submit(chip.dataset.q || chip.textContent);
      });
    });

    append('bot', project.greeting || 'Ask me about this project.');
  }

  window.initProjectChat = initProjectChat;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-project-chat]').forEach(function (el) {
      initProjectChat(el.getAttribute('data-project-chat'), el);
    });
  });
})();
