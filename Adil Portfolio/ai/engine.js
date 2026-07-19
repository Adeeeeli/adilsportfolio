(function () {
  'use strict';

  function score(query, item) {
    const q = query.toLowerCase();
    let s = 0;
    (item.q || []).forEach(function (k) {
      if (q.includes(k)) s += 3;
    });
    if (item.a && item.a.toLowerCase().includes(q)) s += 1;
    return s;
  }

  function allSections(project) {
    const globalSections =
      (window.PORTFOLIO_GLOBAL && window.PORTFOLIO_GLOBAL.sections) || [];
    return (project.sections || []).concat(globalSections);
  }

  /* Send only the most relevant FAQ chunks — smaller prompts = faster Gemini */
  function topSections(project, query, limit) {
    const sections = allSections(project);
    const ranked = sections
      .map(function (it) { return { it: it, s: score(query, it) }; })
      .sort(function (a, b) { return b.s - a.s; });
    const hits = ranked.filter(function (r) { return r.s > 0; }).slice(0, limit || 5);
    if (hits.length) return hits.map(function (r) { return r.it; });
    return sections.slice(0, Math.min(4, sections.length));
  }

  function searchSections(sections, query) {
    const ranked = sections
      .map(function (it) { return { it: it, s: score(query, it) }; })
      .sort(function (a, b) { return b.s - a.s; });
    return ranked[0] && ranked[0].s > 0 ? ranked[0].it.a : null;
  }

  function synthesizeFallback(project, query, history) {
    const prev = history.slice(-4).map(function (x) {
      return x.role + ': ' + x.text;
    }).join(' | ');
    return (
      "Good question. I can go deeper on " + project.title +
      " — try asking about the problem we solved, how the team was structured, or what changed in practice." +
      (prev ? " (We've been on: " + prev + ")" : "")
    );
  }

  function localAnswer(project, query, history) {
    const hit = searchSections(allSections(project), query);
    return hit || synthesizeFallback(project, query, history);
  }

  function buildSystemPrompt(project) {
    const voice = window.PORTFOLIO_VOICE_CONTEXT || '';
    const base = project.systemPrompt || '';
    if (!voice) return base;
    /* Keep voice short — long system prompts slow Flash models */
    const clipped =
      voice.length > 1800 ? voice.slice(0, 1800) + '\n…' : voice;
    return base + '\n\n---\n\nVOICE & IDENTITY CONTEXT:\n' + clipped;
  }

  async function ensureVoiceReady() {
    if (!window.PORTFOLIO_VOICE_READY) return;
    /* Don't stall the ask if markdown voice files are slow to fetch */
    await Promise.race([
      window.PORTFOLIO_VOICE_READY,
      new Promise(function (resolve) { setTimeout(resolve, 350); })
    ]);
  }

  async function llmAnswer(project, projectId, query, history, cfg) {
    await ensureVoiceReady();
    const res = await fetch(cfg.llm.endpoint, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, cfg.llm.headers || {}),
      body: JSON.stringify({
        projectId: projectId,
        query: query,
        history: history,
        systemPrompt: buildSystemPrompt(project),
        context: topSections(project, query, 5),
        summary: project.summary || '',
        fullContext: (project.fullContext || '').slice(0, 3500),
        /* Voice already embedded in systemPrompt — avoid duplicate payload */
        voiceContext: ''
      })
    });
    const data = await res.json().catch(function () { return {}; });
    if (!res.ok) {
      throw new Error((data && data.error) || 'LLM request failed (' + res.status + ')');
    }
    const answer = data.answer || data.text || data.message || '';
    if (!answer) throw new Error('Empty LLM answer');
    return answer;
  }

  /**
   * @returns {Promise<{ answer: string, source: 'llm'|'local'|'local_fallback' }>}
   */
  async function portfolioAsk(projectId, query, history) {
    const project = window.PORTFOLIO_PROJECTS && window.PORTFOLIO_PROJECTS[projectId];
    if (!project) throw new Error('Unknown project: ' + projectId);

    const cfg = window.PORTFOLIO_AI || { mode: 'local' };
    const canLlm = cfg.mode === 'llm' && cfg.llm && cfg.llm.endpoint;
    const allowFallback = cfg.fallbackLocal !== false;

    if (canLlm) {
      try {
        const answer = await llmAnswer(project, projectId, query, history, cfg);
        return { answer: answer, source: 'llm' };
      } catch (err) {
        console.warn('[portfolio AI] LLM failed, using local fallback:', err);
        if (!allowFallback) throw err;
        return { answer: localAnswer(project, query, history), source: 'local_fallback' };
      }
    }

    return { answer: localAnswer(project, query, history), source: 'local' };
  }

  window.portfolioAsk = portfolioAsk;
  window.portfolioBuildSystemPrompt = buildSystemPrompt;
})();
