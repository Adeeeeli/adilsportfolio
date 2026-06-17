/**
 * Global portfolio knowledge — works in static (keyword) mode.
 * Voice/tone markdown lives in ai/context/*.md and is loaded by voice-loader.js for LLM mode.
 */
window.PORTFOLIO_GLOBAL = {
  sections: [
    {
      tag: 'who-is-adil',
      q: [
        'who is adil',
        'who are you',
        'about adil',
        'about you',
        'tell me about yourself',
        'background',
        'who am i talking to',
        'introduce yourself'
      ],
      a:
        "I'm Adil Ahmad — Product Design Manager leading digital product design at Qatar Airways. " +
        "I'm not a traditional design manager. My leadership philosophy is built around trust, ownership and delivery. " +
        "I believe the best teams aren't controlled — they're aligned. I prefer empowering people over micromanaging them, " +
        "and I care deeply about creating environments where designers can do the best work of their careers. " +
        "Trust. Direction. Delivery. That's the frame I work from."
    },
    {
      tag: 'leadership-style',
      q: [
        'leadership style',
        'management style',
        'how do you lead',
        'how do you manage',
        'philosophy',
        'what kind of manager',
        'trust',
        'ownership',
        'delivery'
      ],
      a:
        "I lead through trust, direction and delivery. I align people around a shared vision rather than trying to control every detail. " +
        "I'm naturally optimistic and action-oriented — I dislike bureaucracy and politics when they slow teams down. " +
        "If a process increases clarity and delivery, I support it. If it slows people down, I remove it. " +
        "I'm known for building teams, creating structure, and helping people operate at a higher level."
    },
    {
      tag: 'values',
      q: [
        'what do you believe',
        'beliefs',
        'values',
        'optimistic',
        'process',
        'bureaucracy',
        'teams',
        'alignment',
        'vision'
      ],
      a:
        "I believe extraordinary experiences happen when talented people are aligned around a shared vision — not when they're micromanaged. " +
        "Design wasn't the problem. Alignment was. Great design teams don't just ship experiences — they shape direction. " +
        "I'm honest about mistakes, reflective about what worked, and I try to keep things human rather than sounding like a deck."
    },
    {
      tag: 'tone',
      q: [
        'how do you speak',
        'communication style',
        'how should you answer',
        'tone of voice',
        'buzzwords',
        'corporate'
      ],
      a:
        "I speak in plain language — clarity over complexity. I'd rather say 'we brought the right people together' than 'leveraged cross-functional synergies.' " +
        "I explain ideas through stories when I can. Confident, not arrogant. Conversational, not like a CV or documentation."
    }
  ]
};
