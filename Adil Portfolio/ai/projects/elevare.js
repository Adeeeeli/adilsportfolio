/**
 * Elevare — AI project context
 * Case study: Elevare.html
 */
window.PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS || {};

window.PORTFOLIO_PROJECTS.elevare = {
  id: 'elevare',
  title: 'Elevare',
  summary:
    'Elevare is a premium one-page brand site for Qatar & GCC business setup. ' +
    'Adil designed and built a scroll-driven experience centred on a real-time 3D access pass — ' +
    'React Three Fiber, Lenis smooth scroll, and a restrained black-and-burgundy design system.',
  systemPrompt:
    'You are answering as Adil Ahmad about Elevare, a client website he designed and built. ' +
    'Emphasise the 3D access pass metaphor, scroll-driven storytelling, Qatar/GCC market entry positioning, design system, and motion craft. ' +
    'Answer in first person when describing Adil\'s work. Be conversational, not corporate. Do not use em dashes.',
  greeting:
    'Ask me about Elevare — the 3D pass, scroll experience, design system, or how it was built.',
  starters: [
    'What is Elevare?',
    'How does the 3D pass work?',
    'What tech stack did you use?',
    'How does the scroll and motion work?'
  ],
  fullContext: [
    'Elevare | Client site | Business setup Qatar & GCC | 2026 | React + Vite + WebGL.',
    'Client: Elevare helps foreign companies enter the GCC — company setup, licensing, compliance, and day-to-day operations.',
    'Concept: A single continuous scene — one 3D access pass, one scroll, one narrative. The pass is the metaphor for a license to operate.',
    'Hero: Real-time R3F canvas with kinetic wordmark cycling ENTER → STRUCTURE → OPERATE behind the pass.',
    'Scroll: 13 beats — home, three About chapters with card face swaps, six-service icon banner, service card beats, contact.',
    'Motion: Lenis smooth scroll (lerp 0.1), snap-on-idle to nearest anchor (~0.7s ease-out), cubic-bezier(0.16, 1, 0.3, 1) on all reveals. Fixed camera; only the pass moves.',
    'Design system: Obsidian black (#000), off-white text (#E8E8E8), Qatar burgundy accent (#8A1538). System sans, monospace micro-labels, editorial rhythm.',
    'About: Card face swaps — Qatar map, setup & compliance, growth chart — as copy walks through the value proposition.',
    'Services: Six Core Services horizontal icon rail with scroll-driven spotlight; two closing card beats on delivery.',
    'Contact: Pass peeks above inline form; maroon glow; Book consultation CTA with +974 phone input and WhatsApp fallback.',
    'Responsive: Rebuilt for mobile — kinetic headline at top, pass beneath, dark scrim on services beats, bottom-sheet contact.',
    'Stack: React 19, TypeScript, Vite 5, Three.js, @react-three/fiber, @react-three/drei, GSAP + ScrollTrigger, Lenis, Framer Motion, Tailwind, GLB/PBR materials.',
    'Performance: Memoised canvas, guarded scroll state, CSS-only vignette and film grain. prefers-reduced-motion disables animations.',
    'Adil\'s role: Design and front-end build — brand experience, 3D pass system, scroll architecture, and React implementation.'
  ].join('\n\n'),
  sections: [
    {
      tag: 'overview',
      q: ['elevare', 'what is', 'overview', 'client', 'qatar', 'gcc', 'business setup', 'license to operate'],
      a:
        'Elevare is a premium one-page brand site I designed and built for a Qatar/GCC business-setup consultancy. ' +
        'Instead of a conventional multi-page site, it is one continuous scroll anchored by a real-time 3D access pass — ' +
        'the metaphor for a license to operate in the region.'
    },
    {
      tag: '3d-pass',
      q: ['3d', 'card', 'pass', 'webgl', 'three', 'glb', 'digital pass', 'access pass'],
      a:
        'The hero is a real-time 3D model of a physical access pass rendered in React Three Fiber. ' +
        'A kinetic wordmark cycles ENTER → STRUCTURE → OPERATE behind it. ' +
        'The pass never leaves the screen — it re-poses, tilts, and swaps printed faces as you scroll through thirteen beats.'
    },
    {
      tag: 'scroll',
      q: ['scroll', 'lenis', 'gsap', 'snap', 'story', 'sections', '13', 'motion', 'anchors'],
      a:
        'Thirteen scroll beats drive the narrative. Lenis smooths the wheel with lerp 0.1; when scrolling goes quiet, the view eases to the nearest anchor over about 0.7 seconds. ' +
        'A fixed camera keeps every pose deterministic — the card moves, the camera never does. ' +
        'Every reveal uses cubic-bezier(0.16, 1, 0.3, 1) for a single motion fingerprint.'
    },
    {
      tag: 'design',
      q: ['design', 'ui', 'ux', 'burgundy', 'qatar', 'design system', 'color', 'typography'],
      a:
        'Pure black stage, off-white text, and one accent: Qatar burgundy (#8A1538). ' +
        'Semibold system sans with generous negative space, monospace micro-labels, and hairline dividers. ' +
        'Nothing competes with the pass — the palette is deliberately restrained and premium.'
    },
    {
      tag: 'sections',
      q: ['sections', 'pages', 'home', 'about', 'services', 'contact', 'walkthrough', 'site map'],
      a:
        'Five movements on one object: Home hero with the pass and kinetic headline; About with three chapters and card face swaps; ' +
        'Services with a six-icon scroll banner and two delivery beats; Contact with the pass above an inline form. ' +
        'Mobile rebuilds each section for thumb-first layout.'
    },
    {
      tag: 'services',
      q: ['services', 'setup', 'compliance', 'banking', 'pro', 'operations', 'growth', 'six'],
      a:
        'Six Core Services scroll through a horizontal icon rail with a central spotlight frame — Business Setup, Licensing & Compliance, ' +
        'Corporate Services, Banking & PRO, Operations Support, and Growth & Market Entry. ' +
        'Two later card beats explain delivery from market entry to ongoing operations.'
    },
    {
      tag: 'responsive',
      q: ['mobile', 'responsive', 'phone', 'thumb'],
      a:
        'Mobile is not a squeeze of desktop. The hero wordmark moves to the top as a kinetic headline with the pass floating beneath; ' +
        'a dark scrim drops behind the card on services beats for legibility; contact uses a bottom-sheet form with the pass peeking above.'
    },
    {
      tag: 'tech',
      q: ['tech', 'stack', 'react', 'vite', 'typescript', 'r3f', 'tailwind', 'built with', 'performance'],
      a:
        'React 19 + Vite 5 + TypeScript, Tailwind for layout, React Three Fiber and Drei for the pass, GSAP ScrollTrigger, Lenis, Framer Motion. ' +
        'One lazy-mounted R3F canvas across all sections; PBR materials swap textures for three card faces. ' +
        'Atmosphere is CSS-only vignette and film grain — no per-frame JS cost.'
    },
    {
      tag: 'role',
      q: ['role', 'adil', 'your work', 'led', 'designed', 'client'],
      a:
        'I handled design and front-end build end to end — brand experience, 3D pass system, scroll story architecture, and the full React implementation. ' +
        'Every section pose is tuned and locked so a refresh always lands the card in exactly the same place.'
    }
  ]
};
