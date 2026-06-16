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
      "I can answer questions about " + project.title + " — try asking about the plan of action, " +
      "roles, onboarding, research, or how the lab was structured." +
      (prev ? " (We've been discussing: " + prev + ")" : "")
    );
  }

  function localAnswer(project, query, history) {
    const hit = searchSections(project.sections || [], query);
    return hit || synthesizeFallback(project, query, history);
  }

  async function portfolioAsk(projectId, query, history) {
    const project = window.PORTFOLIO_PROJECTS && window.PORTFOLIO_PROJECTS[projectId];
    if (!project) throw new Error('Unknown project: ' + projectId);

    const cfg = window.PORTFOLIO_AI || { mode: 'local' };
    if (cfg.mode === 'llm' && cfg.llm && cfg.llm.endpoint) {
      const res = await fetch(cfg.llm.endpoint, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, cfg.llm.headers || {}),
        body: JSON.stringify({
          projectId: projectId,
          query: query,
          history: history,
          systemPrompt: project.systemPrompt || '',
          context: project.sections || [],
          summary: project.summary || '',
          fullContext: project.fullContext || ''
        })
      });
      if (!res.ok) throw new Error('LLM request failed (' + res.status + ')');
      const data = await res.json();
      return data.answer || data.text || data.message || '';
    }

    return localAnswer(project, query, history);
  }

  window.portfolioAsk = portfolioAsk;
})();
