/**
 * Portfolio AI — global config
 *
 * mode: 'local'  → free keyword answers (no API)
 * mode: 'llm'    → Gemini via Cloudflare Worker (see workers/portfolio-ai/)
 */
window.PORTFOLIO_AI = {
  mode: 'llm',
  llm: {
    endpoint: 'https://adil-portfolio-ai.adil-3.workers.dev/ask',
    headers: {}
  },
  /* If LLM is down or key missing, engine falls back to local keyword mode */
  fallbackLocal: true
};
