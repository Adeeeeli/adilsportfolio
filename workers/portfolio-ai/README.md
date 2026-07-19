# Portfolio AI — Gemini Flash (free tier)

Tiny Cloudflare Worker that calls Google Gemini so your API key never sits in the public site.

## One-time setup

### 1. Get a free Gemini key
1. Open [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. **Do not enable billing** on that project if you want to stay on free tier

### 2. Deploy the Worker
```bash
cd workers/portfolio-ai
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY
# paste your Gemini key when prompted
```

Copy the Worker URL from deploy output, e.g.  
`https://adil-portfolio-ai.<your-subdomain>.workers.dev`

### 3. Point the site at the Worker
Edit `Adil Portfolio/ai/config.js`:

```js
window.PORTFOLIO_AI = {
  mode: 'llm',
  llm: {
    endpoint: 'https://adil-portfolio-ai.YOUR_SUBDOMAIN.workers.dev/ask',
    headers: {}
  }
};
```

Commit + push (or set the URL now and push once).

### 4. Local test
```bash
# Terminal A — Worker
cd workers/portfolio-ai && npm run dev

# Terminal B — site
cd ../.. && python3 -m http.server 8767
```

Open a case study, ask the chat something. If the Worker URL in config still points at production, change it temporarily to `http://127.0.0.1:8787/ask` (Wrangler default).

## Notes
- Default model: `gemini-3.5-flash` (free tier)
- On LLM failure, the site falls back to local keyword answers
- Allowed origins include `adilahmad.co.uk` + localhost (see `wrangler.toml`)
