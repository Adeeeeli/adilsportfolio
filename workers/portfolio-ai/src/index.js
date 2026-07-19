/**
 * Portfolio AI proxy — Gemini Flash free tier
 * Keeps GEMINI_API_KEY off the public site.
 *
 * POST /ask  { projectId, query, history, systemPrompt, summary, fullContext, context, voiceContext }
 * → { answer: string }
 */

const MAX_QUERY_CHARS = 800;
const MAX_HISTORY = 6;
const MAX_CONTEXT_CHARS = 9000;

function corsHeaders(origin, allowedOrigins) {
  const allowed = (allowedOrigins || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const ok =
    origin &&
    (allowed.includes(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin));

  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
  });
}

function clip(text, max) {
  const s = String(text || '');
  if (s.length <= max) return s;
  return s.slice(0, max) + '\n…[truncated]';
}

function formatSections(context) {
  if (!Array.isArray(context) || !context.length) return '';
  return context
    .slice(0, 8)
    .map((item, i) => {
      const tag = item.tag || 'section-' + (i + 1);
      const a = item.a || '';
      return '[' + tag + ']\n' + clip(a, 700);
    })
    .join('\n\n');
}

function buildUserPrompt(body) {
  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY) : [];
  const historyText = history
    .map((h) => {
      const role = h.role === 'user' ? 'Visitor' : 'Adil';
      return role + ': ' + clip(h.text || '', 280);
    })
    .join('\n');

  const parts = [
    'PROJECT: ' + (body.projectId || 'unknown'),
    body.summary ? 'SUMMARY:\n' + clip(body.summary, 700) : '',
    body.fullContext ? 'CASE STUDY CONTEXT:\n' + clip(body.fullContext, 3200) : '',
    formatSections(body.context)
      ? 'FAQ / KNOWLEDGE SECTIONS:\n' + clip(formatSections(body.context), 2800)
      : '',
    historyText ? 'RECENT CHAT:\n' + historyText : '',
    'VISITOR QUESTION:\n' + clip(body.query, MAX_QUERY_CHARS),
    'Reply in first person as Adil. Max 3 short sentences unless they ask for depth. Use only the context above. No em dashes.',
  ];

  return parts.filter(Boolean).join('\n\n');
}

function generationConfigForModel(model) {
  /* Keep answers short and skip deep thinking — portfolio chat needs speed */
  const config = {
    maxOutputTokens: 512,
    temperature: 0.4,
  };
  if (/gemini-3/i.test(model)) {
    config.thinkingConfig = { thinkingLevel: 'minimal' };
  } else if (/2\.5/i.test(model)) {
    config.thinkingConfig = { thinkingBudget: 0 };
  }
  return config;
}

async function callGemini(env, systemPrompt, userPrompt) {
  const key = env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  /* Prefer a fast Flash model; fall back if this key can't use it */
  const preferred = env.GEMINI_MODEL || 'gemini-3.5-flash';
  const models = [preferred, 'gemini-3.5-flash'].filter(function (m, i, arr) {
    return m && arr.indexOf(m) === i;
  });

  let lastErr = null;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      return await callGeminiModel(key, model, systemPrompt, userPrompt);
    } catch (err) {
      lastErr = err;
      const msg = String((err && err.message) || err);
      const unavailable =
        /no longer available|not found|not supported|INVALID_ARGUMENT|exceeded your current quota|rate.limit|limit: 0/i.test(
          msg
        );
      if (!unavailable || i === models.length - 1) throw err;
    }
  }
  throw lastErr || new Error('Gemini request failed');
}

async function callGeminiModel(key, model, systemPrompt, userPrompt) {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(model) +
    ':generateContent';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': key,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: clip(systemPrompt || 'You are Adil Ahmad answering about this case study.', 2500) }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: clip(userPrompt, MAX_CONTEXT_CHARS) }],
        },
      ],
      generationConfig: generationConfigForModel(model),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data.error && data.error.message) ||
      'Gemini request failed (' + res.status + ')';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  const candidate = data.candidates && data.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;

  const text = Array.isArray(parts)
    ? parts
        .filter(function (p) {
          return p && p.text && !p.thought;
        })
        .map(function (p) {
          return p.text;
        })
        .join('')
        .trim()
    : '';

  if (!text) {
    throw new Error('Empty response from Gemini');
  }
  return text;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json(
        {
          ok: true,
          service: 'adil-portfolio-ai',
          model: env.GEMINI_MODEL || 'gemini-3.5-flash',
        },
        200,
        headers
      );
    }

    if (request.method !== 'POST' || url.pathname !== '/ask') {
      return json({ error: 'Not found' }, 404, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON' }, 400, headers);
    }

    const query = (body && body.query ? String(body.query) : '').trim();
    if (!query) {
      return json({ error: 'Missing query' }, 400, headers);
    }
    if (query.length > MAX_QUERY_CHARS) {
      return json({ error: 'Query too long' }, 400, headers);
    }

    try {
      const systemPrompt = [
        body.systemPrompt || '',
        body.voiceContext ? '\n\nVOICE & IDENTITY:\n' + clip(body.voiceContext, 4000) : '',
      ]
        .join('')
        .trim();

      const answer = await callGemini(env, systemPrompt, buildUserPrompt(body));
      return json({ answer }, 200, headers);
    } catch (err) {
      const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
      return json(
        { error: err.message || 'Upstream error', answer: null },
        status,
        headers
      );
    }
  },
};
