(function () {
  'use strict';

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

  function setupFloatUI(root, projectId) {
    const fab = root.querySelector('.proj-chat-fab');
    const panel = root.querySelector('.proj-chat-panel');
    const closeBtn = root.querySelector('.proj-chat-panel-close');
    const $input = root.querySelector('.proj-chat-input');
    if (!fab || !panel) return;

    function open() {
      root.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      trackEvent('ai_chat_panel_open', { project_id: projectId || '' });
      window.setTimeout(function () {
        if ($input) $input.focus();
      }, 280);
    }

    function close() {
      root.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      trackEvent('ai_chat_panel_close', { project_id: projectId || '' });
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

    setupFloatUI(root, projectId);

    const $log = root.querySelector('.proj-chat-log');
    const $form = root.querySelector('.proj-chat-form');
    const $input = root.querySelector('.proj-chat-input');
    const $send = root.querySelector('.proj-chat-send');
    const $panel = root.querySelector('.proj-chat-panel');
    const $chips = root.querySelector('.proj-chat-chips');
    if (!$log || !$form || !$input || !$send) return;

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
        $input.focus();
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

    root.querySelectorAll('.proj-chat-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        submit(chip.dataset.q || chip.textContent, 'chip');
      });
    });

    trackEvent('ai_chat_ready', { project_id: projectId });

    append('bot', project.greeting || 'Ask me about this project.');
    syncChatLayout();
  }

  window.initProjectChat = initProjectChat;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-project-chat]').forEach(function (el) {
      initProjectChat(el.getAttribute('data-project-chat'), el);
    });
  });
})();
