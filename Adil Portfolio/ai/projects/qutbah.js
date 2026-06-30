/**
 * Qutbah — AI project context
 * Case study: Qutbah.html
 */
window.PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS || {};

window.PORTFOLIO_PROJECTS.qutbah = {
  id: 'qutbah',
  title: 'Qutbah',
  summary:
    'Qutbah is a live iOS app for real-time AI translation of the Friday khutbah (sermon). ' +
    'It recognises Quran verses across 6,236 ayahs, attributes Hadith with grading, transcribes Arabic on-device via Apple STT, ' +
    'and delivers sub-2 second translation latency without requiring internet.',
  systemPrompt:
    'You are answering as Adil Ahmad about Qutbah, his live iOS AI translation app for the Friday sermon. ' +
    'Emphasise on-device privacy, Quran verse recognition, Hadith attribution, Apple speech-to-text, and speed. ' +
    'Answer in first person when describing Adil\'s work. Be conversational, not corporate. Do not use em dashes.',
  greeting:
    'Ask me about Qutbah — what it does, how Quran matching works, offline translation, or the tech stack.',
  starters: [
    'What is Qutbah?',
    'How does Quran recognition work?',
    'Does it work offline?',
    'What tech stack did you use?'
  ],
  fullContext: [
    'QUTBAH | Live iOS app | v1.0 | Friday Sermon Translation | 2026.',
    'Tagline: The Friday sermon, translated as it is spoken — Quran and Hadith verified from an on-device corpus.',
    'Pipeline: Arabic STT (Apple on-device) → live translation (Groq LLaMA) → Quran verifier (6,236 ayahs) → Hadith specialist → arbiter decides what to surface.',
    'Quran: composite similarity matching swaps paraphrase for canonical verse, reference and translation on a warm scripture card.',
    'Hadith: local corpus attribution with collection, number and grading (Sahih, etc.).',
    'Design: ice gradient app UI for in-mosque legibility; deep navy brand world with emerald and gold accents. Material 3 tokens as single source of truth.',
    'Screens: live translation, verified Quran card, attributed Hadith, session history with scripture flags.',
    'Tech: React Native, Expo SDK 54, expo-router, @jamsch/expo-speech-recognition, local Quran DB, local Hadith corpus, Groq LLaMA 3.1, expo-translate, Zustand.',
    'Adil\'s role: Design and engineering — product UX, scripture verification pipeline, and React Native implementation.'
  ].join('\n\n'),
  sections: [
    {
      tag: 'overview',
      q: ['qutbah', 'what is', 'overview', 'app', 'khutbah', 'sermon', 'friday'],
      a:
        'Qutbah is my live iOS app for real-time AI translation of the Friday khutbah. ' +
        'It translates spoken Arabic as the imam delivers the sermon, recognises Quran verses, attributes Hadith with source grading, ' +
        'and does it on-device with sub-2 second latency — no internet required.'
    },
    {
      tag: 'quran',
      q: ['quran', 'verse', 'ayah', 'recognition', 'match', '6236', 'surah'],
      a:
        'When the imam recites Quran, Qutbah matches against a local corpus of all 6,236 ayahs. ' +
        'It surfaces the Arabic text, English translation, and surah reference — with composite match scoring around 0.93 in testing.'
    },
    {
      tag: 'hadith',
      q: ['hadith', 'attribution', 'source', 'grading', 'sahih', 'prophet'],
      a:
        'For Hadith content, the app attributes sources from a local corpus with confidence scoring and grading (e.g. Sahih). ' +
        'You see the Arabic, English translation, and source reference — not just a generic translation blob.'
    },
    {
      tag: 'offline',
      q: ['offline', 'on-device', 'internet', 'privacy', 'latency', 'speed', '2 second'],
      a:
        'Everything critical runs on-device: Apple speech-to-text for Arabic, local Quran and Hadith corpora, and fast translation. ' +
        'Sub-2 second latency and no internet dependency — important in a mosque context where connectivity is unreliable.'
    },
    {
      tag: 'stt',
      q: ['speech', 'stt', 'apple', 'arabic', 'transcription', 'microphone', 'listen'],
      a:
        'Arabic speech-to-text uses Apple\'s on-device STT. The app listens during the sermon, shows interim "Listening…" state, ' +
        'and streams plain translation chunks alongside structured Quran and Hadith cards as content is recognised.'
    },
    {
      tag: 'tech',
      q: ['tech', 'stack', 'react native', 'expo', 'groq', 'llama', 'built with'],
      a:
        'Built with React Native and Expo SDK 54. Apple on-device STT for Arabic transcription. Local Quran + Hadith corpus for recognition and attribution. Groq LLaMA 3.1 for translation. Live on iOS v1.0.'
    },
    {
      tag: 'live',
      q: ['live', 'ios', 'shipped', 'version', 'status'],
      a: 'Qutbah is live on iOS at v1.0. The product UI shows a live badge during active sermon translation.'
    }
  ]
};
