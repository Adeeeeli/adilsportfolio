/**
 * Portfolio AI — global config
 * Set mode: 'llm' + llm.endpoint when your backend is ready.
 * Reversible: remove scripts from case study pages to disable chat.
 */
window.PORTFOLIO_AI = {
  mode: 'local',
  llm: {
    endpoint: null,
    // Optional: 'Authorization': 'Bearer …' via headers below
    headers: {}
  }
};
