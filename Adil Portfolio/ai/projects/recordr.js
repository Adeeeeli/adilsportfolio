/**
 * Recordr — AI project context
 * Case study: Recordr.html
 */
window.PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS || {};

window.PORTFOLIO_PROJECTS.recordr = {
  id: 'recordr',
  title: 'Recordr',
  summary:
    'Recordr is a macOS screen recorder built from scratch with Electron. ' +
    'It captures your screen, auto-detects cursor dwell points for Smart Zoom, composites onto 40+ backgrounds, and exports MP4 or WebM — no timeline editing required.',
  systemPrompt:
    'You are answering as Adil Ahmad about Recordr, his open-source macOS screen recording app. ' +
    'Emphasise Smart Zoom auto-direction, glass UI design, Electron capture pipeline, canvas compositor, and one-click export. ' +
    'Answer in first person when describing Adil\'s work. Be conversational, not corporate. Do not use em dashes.',
  greeting:
    'Ask me about Recordr — Smart Zoom, the glass UI, capture pipeline, or how it was built.',
  starters: [
    'What is Recordr?',
    'How does Smart Zoom work?',
    'What tech stack did you use?',
    'How does the recording flow work?'
  ],
  fullContext: [
    'Recordr | Open source | macOS screen recorder | 2026 | Electron.',
    'Concept: Screen Studio-style recorder — film your screen, auto-zoom into action, drop onto a designed background. No keyframing.',
    'Smart Zoom: After recording, scans cursor telemetry, detects dwell regions, lays down zoom regions automatically. Ported from OpenScreen zoom model.',
    'Zoom feel: Snappy in (~600ms), gentle out (~800ms). Connected pans between nearby regions (~700ms). Every region toggleable on timeline.',
    'Flow: Four states — pick source, record (floating pill bar), render (compositor progress), finish (review + export).',
    'UI: Raycast-style glass — backdrop-filter blur(40px) saturate(180%), red record dot, green confirm, purple Smart Zoom accents.',
    'Design tokens: Canvas #0C0C0E, Record Red #FF3B30, Confirm Green #32D74B, Zoom Purple #BF5AF2.',
    'Capture: Electron desktopCapturer + getDisplayMedia, optional camera overlay and mic, cursor telemetry for zoom engine.',
    'Compositor: Custom canvas pipeline — background (gradient/wallpaper/blur), padding, rounded device frame, cursor, motion blur, spring-eased zoom.',
    'Export: mp4-muxer H.264 MP4 or WebM VP9 with live progress. 40+ gradient and wallpaper backgrounds.',
    'Stack: Electron, Canvas 2D, spring.js, OpenScreen zoom model, WebCodecs, SF Pro system UI.',
    'Adil\'s role: Design and engineering — product UX, glass interface, compositor, Smart Zoom tuning, and Electron implementation.'
  ].join('\n\n'),
  sections: [
    {
      tag: 'overview',
      q: ['recordr', 'what is', 'overview', 'screen recording', 'macos', 'screen studio'],
      a:
        'Recordr is my open-source macOS screen recorder. You hit record, do your thing, and it hands back a polished clip with cinematic auto-zooms and a designed backdrop — no timeline scrubbing.'
    },
    {
      tag: 'smart-zoom',
      q: ['smart zoom', 'auto zoom', 'zoom', 'cursor', 'dwell', 'openscreen'],
      a:
        'Smart Zoom scans cursor telemetry after you stop, groups dwell points into regions, and auto-directs the camera — punch in, pan between hotspots, ease out. Every region is a toggle on the timeline if you want to override.'
    },
    {
      tag: 'design',
      q: ['design', 'glass', 'ui', 'raycast', 'hig', 'red', 'purple'],
      a:
        'The UI is floating glass surfaces over your desktop — heavy blur, 1px top sheen, system-native dark tones. Red to record, green to confirm, purple for Smart Zoom. Same material from the picker bar to settings to the finish card.'
    },
    {
      tag: 'flow',
      q: ['flow', 'pick', 'record', 'render', 'finish', 'states', 'screens'],
      a:
        'Four moments: pick a display or window with optional camera/mic/Smart Zoom, record with a thin floating pill, render while the compositor builds frames, then finish to review zoom regions and export MP4 or WebM.'
    },
    {
      tag: 'stack',
      q: ['tech', 'stack', 'electron', 'canvas', 'webcodecs', 'export', 'mp4'],
      a:
        'Electron for capture and windowing, a hand-written Canvas 2D compositor for the look, OpenScreen-derived zoom logic, and mp4-muxer/WebM for export. No editor framework, no cloud.'
    }
  ]
};
