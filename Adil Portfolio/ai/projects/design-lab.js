/**
 * Building Design Lab: full project context
 * Local KB: sections[].q + sections[].a
 * LLM: systemPrompt + fullContext + sections sent via portfolioAsk()
 */
window.PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS || {};

window.PORTFOLIO_PROJECTS['design-lab'] = {
  id: 'design-lab',
  title: 'Building Design Lab Pitchdeck',
  summary:
    'Design Lab was an internal strategic initiative created by Adil Ahmad at Qatar Airways to transform product design across the mobile app ecosystem, moving from fragmented pod execution to a self-governed squad shaping North Star experiences.',
  systemPrompt:
    'You are an assistant for Adil Ahmad\'s leadership case study "Building Design Lab" at Qatar Airways (2025). ' +
    'Position Design Lab as a strategic leadership and organizational transformation initiative, not just a presentation or concept deck. ' +
    'Emphasize alignment as the core problem, Adil as creator and driver, the North Star approach, phased rollout, governance, and the wallet proof of concept. ' +
    'Speak with leadership framing: systems thinking, executive communication, change management. ' +
    'Answer only from the provided context. Be concise and interview-ready. Do not use em dashes in your replies.',
  greeting:
    'Ask me anything about Design Lab: the problem we solved, the squad model, the four phases, governance, or the wallet proof of concept.',
  starters: [
    'What problem was Design Lab solving?',
    'What was the vision and operating model?',
    'Walk me through the four phases',
    "What was Adil's role?",
    'Tell me about the wallet proof of concept'
  ],
  fullContext: [
    'DESIGN LAB | Qatar Airways | Product Design Management | 2025 | Created by Adil Ahmad.',
    'Design Lab transformed how product design operated across the mobile app ecosystem, addressing fragmentation across digital product pods.',
    'Core problem: alignment, not poor design quality. Designers embedded individually in pods → disconnected experiences, roadmap-only thinking, reactive innovation, siloed product thinking.',
    'Vision: a strategically formed, self-governed design division (~4–5 designers as one squad) shaping extraordinary experiences for today and tomorrow. Mission: support and elevate product pods, not replace them.',
    'Phases: 0 Onboarding → 1 Research & Discovery (~1 month, FigJam ecosystem map) → 2 Shaping the Vision (~2 months, North Star prototype) → 3 Executive Alignment → 4 Implementation (incremental roadmap from North Star).',
    'Team: internal + contractor designers (app intervention pod). Principal Designer Lead (Adil: vision, stakeholders, North Star, workshops, pitch), UI Product Designer, Hybrid UX/UI Product Designer. Multi-disciplinary squad, not isolated contributors.',
    'Adil: creator, Principal Design Lead, strategic owner. Concept, squad model, stakeholder alignment, senior leadership pitch, phased rollout, North Star vision and execution. Strategic transformation, not just a design proposal.',
    'Proof of concept: wallet/payments (loyalty wallet, Avios, transfers, premium digital experiences).',
    'Key quotes: "Design wasn\'t the problem. Alignment was." / "One squad. Shared vision. Extraordinary experiences."'
  ].join('\n\n'),
  sections: [
    {
      tag: 'overview',
      q: ['design lab', 'what is design lab', 'overview', 'initiative', 'what was this', 'summary'],
      a: 'Design Lab was an internal strategic initiative I created at Qatar Airways to transform how product design operated across the mobile app ecosystem. It addressed fragmentation across digital product pods by introducing a collaborative, self-governed squad model, elevating design from feature execution into a strategic capability shaping the future customer experience.'
    },
    {
      tag: 'problem',
      q: ['problem', 'challenge', 'why needed', 'alignment', 'fragmentation', 'pods', 'silo', 'core issue'],
      a: 'The core problem wasn\'t poor design quality. It was alignment. At scale, designers were embedded individually in product pods with limited cross-domain collaboration. Experiences became disconnected, teams optimized for roadmap delivery over long-term CX, and innovation was reactive. I framed this as an organizational design challenge, not just a UX problem. The system of working needed redesigning. "Design wasn\'t the problem. Alignment was."'
    },
    {
      tag: 'vision',
      q: ['vision', 'operating model', 'squad', 'north star', 'mission', 'self-governed', 'future'],
      a: 'Instead of one designer per squad in traditional pods, Design Lab would be a dedicated innovation and execution division: a strategically formed, self-governed squad of ~4–5 designers focused on future product vision, connected experiences, cross-domain collaboration, design system improvements, roadmap influence, strategic innovation, and feature acceleration. The mission wasn\'t to replace pods. It was to support and elevate them. "One squad. Shared vision. Extraordinary experiences."'
    },
    {
      tag: 'why-needed',
      q: ['why', 'business case', 'benefits', 'reasons', 'needed', 'value'],
      a: 'Design Lab solved five challenges: (1) Creating extraordinary experiences beyond incremental delivery, (2) Co-defining the product roadmap instead of reacting to requirements, (3) Strengthening the design system through a shared squad, (4) Unlocking business opportunities (e.g. wallet/payments), and (5) Accelerating delivery through collaborative design rather than isolated ownership.'
    },
    {
      tag: 'team-structure',
      q: ['team', 'structure', 'roles', 'responsibilities', 'squad', 'specialisms', 'who was on', 'principal designer', 'ui designer', 'hybrid'],
      a: 'The proposed structure combined internal and contractor designers funded through the app intervention pod: a multi-disciplinary squad with complementary strengths, not isolated contributors. Principal Designer Lead (Strategic Leadership), led by me: strategic direction and vision alignment, stakeholder communication and executive buy-in, mentorship and team guidance, workflow and process optimisation, QA and sign-off across design outputs, workshops and alignment sessions, pitching to senior leadership, driving organisational alignment around the future vision, keeping Design Lab connected to business priorities and CX outcomes. Product Designer (UI Focus): visually elevated interfaces, rapid prototyping, design system contribution and maintenance, high-fidelity UI delivery, feature execution. Product Designer (Hybrid UX/UI): user journey mapping, information architecture, design thinking and ideation workshops, rapid usability testing, cross-functional collaboration with PMs and stakeholders. Goal: a highly collaborative squad thinking strategically while executing at speed.'
    },
    {
      tag: 'adil-role',
      q: ['adil', 'your role', 'my role', 'creator', 'lead', 'what did you do', 'responsibilities', 'principal design lead'],
      a: 'I was the creator, Principal Design Lead and strategic owner of Design Lab. I identified how product design operated at scale and proposed a model focused on alignment, connected experiences and future vision. I personally: created the Design Lab concept; identified the organisational challenges it would solve; defined the squad operating model; structured roles and responsibilities; led stakeholder alignment sessions; built and presented the senior leadership pitch; facilitated workshops with product and design teams; defined the phased rollout strategy; connected design outcomes to business opportunities; led the North Star vision and execution strategy. Design Lab was not simply a design proposal. It was a strategic transformation initiative to reshape how digital experiences were built at Qatar Airways. Demonstrated strengths: design leadership, systems thinking, executive storytelling, organisational design, product strategy, change management.'
    },
    {
      tag: 'phase-0',
      q: ['phase 0', 'onboarding', 'kickoff', 'stakeholder onboarding', 'phase zero'],
      a: 'Phase 0: Onboarding. Before implementation, onboard all stakeholders: educate product owners, align PMs and designers, introduce the vision, and establish ways of working through workshops and kickoff sessions.'
    },
    {
      tag: 'phase-1',
      q: ['phase 1', 'research', 'discovery', 'interviews', 'figjam', 'ecosystem', 'one month'],
      a: 'Phase 1: Research & Discovery (~1 month). Understand the full mobile ecosystem via senior stakeholder interviews, alignment workshops, PO collaboration, competitive benchmarking, industry analysis, pain point mapping, and data-informed research. Deliverable: a large FigJam with current journeys, opportunities, pain points, strategic ideas, and experience mapping. Outcome: full domain understanding and future opportunities.'
    },
    {
      tag: 'phase-2',
      q: ['phase 2', 'shaping', 'vision', 'prototype', 'north star', 'two months', 'future state'],
      a: 'Phase 2: Shaping the Vision (~2 months). Redesign information architecture, reimagine user flows, create new UI paradigms, challenge industry norms, rapid usability testing, bi-weekly stakeholder updates, monthly leadership reviews. Deliverable: a high-fidelity interactive prototype of the future Qatar Airways app, a complete end-to-end future-state experience.'
    },
    {
      tag: 'phase-3',
      q: ['phase 3', 'executive', 'alignment', 'approval', 'buy-in', 'leadership', 'c-level'],
      a: 'Phase 3: Executive Alignment & Approvals. Gain organizational buy-in from senior leadership, product leadership, brand, executives, and C-level sponsors. Align all mobile pods, secure approval, and communicate the shared North Star. "Big visions require belief."'
    },
    {
      tag: 'phase-4',
      q: ['phase 4', 'implementation', 'rollout', 'roadmap', 'delivery', 'incremental'],
      a: 'Phase 4: Implementation. Deliver the future vision gradually by working backwards: break the North Star into achievable roadmap increments. Pods keep shipping while moving toward the bigger vision. Innovation without disruption, roadmap continuity, progressive transformation. Existing pod designers would eventually be absorbed into Design Lab in later phases.'
    },
    {
      tag: 'governance',
      q: ['governance', 'showcase', 'bi-weekly', 'monthly', 'visibility', 'communication'],
      a: 'Strong communication model: bi-weekly showcases for product teams, designers, and stakeholders (progress, feedback, transparency) plus monthly leadership alignment for executive visibility, decisions, and buy-in, so design work never stayed siloed and everyone moved in one direction.'
    },
    {
      tag: 'innovation-stream',
      q: ['innovation stream', 'side projects', 'ventures', 'outside roadmap'],
      a: 'A secondary innovation stream let Design Lab explore and prototype opportunities outside committed roadmap delivery, staying innovative while pods hit their priorities.'
    },
    {
      tag: 'wallet-poc',
      q: ['wallet', 'payments', 'proof of concept', 'poc', 'avios', 'loyalty', 'validation'],
      a: 'Design Lab validated the squad model through a wallet and payments proof of concept: loyalty wallet, Avios management, payments, transfers, and premium digital experiences. This showed collaborative squad output could beat isolated pod execution.'
    },
    {
      tag: 'leadership-lessons',
      q: ['leadership', 'lessons', 'themes', 'skills', 'what did you learn', 'strengths'],
      a: 'Leadership themes: (1) Systems thinking: organizational problems, not only UI, (2) Strategic design leadership tied to business goals, (3) Executive communication and influence, (4) Organizational design: new operating models, (5) Change management, (6) Vision setting and alignment around future experiences.'
    },
    {
      tag: 'quotes',
      q: ['quote', 'quotes', 'key message', 'tagline'],
      a: '"Design wasn\'t the problem. Alignment was." · "Extraordinary experiences don\'t happen by accident. They happen through alignment." · "Design should not just support delivery. It should shape the future." · "One squad. Shared vision. Extraordinary experiences."'
    },
    {
      tag: 'how-to-frame',
      q: ['how should', 'position', 'frame', 'talk about', 'interview'],
      a: 'Frame Design Lab as a serious design operating model and strategic leadership initiative: organizational transformation at scale, not an internal deck. Emphasize alignment, collaboration, North Star vision, my role as creator and driver, phased rollout, governance, and wallet POC as validation.'
    }
  ]
};
