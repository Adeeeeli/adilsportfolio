/**
 * Design Process 2.0 — case study context
 * Visual: Adil Portfolio/design-lab/design 2.0.png
 * Full narrative: design-process-2.0-context.md
 */
window.PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS || {};

window.PORTFOLIO_PROJECTS['design-process-2.0'] = {
  id: 'design-process-2.0',
  title: 'Design Process 2.0',
  summary:
    'When I joined Qatar Airways, designer quality was not the problem — the process was. I redesigned how design operates at scale: ' +
    'Design 2.0 introduced clearer stages, stronger governance and visibility across discovery, review, handover and delivery. ' +
    'It became the standard process across Qatar Airways Digital.',
  systemPrompt:
    'You are answering as Adil Ahmad about his leadership case study "Design Process 2.0" at Qatar Airways. ' +
    'The core story: talent was strong but the system was broken — unclear requirements, late stakeholders, inconsistent reviews, rework. ' +
    'Adil redesigned the organisation\'s design process for clarity, alignment, consistency and adoption — not more bureaucracy. ' +
    'Answer in first person. Be conversational, not corporate. Use the provided context only. Do not use em dashes.',
  greeting:
    'Ask me about Design 2.0 — why I rebuilt the process, what we heard in discovery, how it works, or what changed across the organisation.',
  starters: [
    'What problem were you solving?',
    'What is Design 2.0?',
    'What did discovery reveal?',
    'What was the impact?',
    'What did you learn?'
  ],
  fullContext: [
    'DESIGN PROCESS 2.0 | Qatar Airways Digital | Product Design Management | Created by Adil Ahmad.',
    'Headline: Transforming how design operates at scale.',
    'On joining: designer quality was not the problem. The process was.',
    'Frustrations heard across teams: POs felt design took too long; designers felt requirements were unclear; stakeholders joined too late; reviews were inconsistent; expectations varied by team. Hard work without shared direction → rework, missed expectations, frustration.',
    'Insight: not isolated issues — the challenge was the system, not individual performance.',
    'Goals: clarity and ownership, less rework, better stakeholder alignment, consistency across teams, confidence in what good looks like, stronger Product–Design–Engineering collaboration. A process people would actually use.',
    'Discovery themes: unclear requirements, late stakeholder feedback, limited visibility, inconsistent review standards, weak ownership between teams, different ways of working across domains. Mapped existing process and friction points.',
    'Design 2.0: clearer stages, stronger governance, visibility through the lifecycle. Structured discovery, review checkpoints, stakeholder involvement, improved handovers, quality standards, accountability. Goal: remove ambiguity, not add process.',
    'Stages: Sprint 0 → Design → QA → Launch → Review (evolved from Ideation → Design → QA → Launch).',
    'Impact: became standard across Qatar Airways Digital; supports multiple teams; improved alignment, consistency, shared understanding of idea-to-delivery; scaled beyond Adil\'s direct involvement.',
    'Reflection: great outcomes come from the right environment for talented people. Design 2.0 was about clarity, confidence and structure — not more process for its own sake.'
  ].join('\n\n'),
  sections: [
    {
      tag: 'overview',
      q: ['design process 2.0', 'design 2.0', 'process 2.0', 'overview', 'what is', 'summary', 'what changed'],
      a:
        'When I joined Qatar Airways, it became clear fast: the quality of our designers wasn\'t the problem — the process was. ' +
        'Everyone was working hard, but not always in the same direction. I stepped back and treated it as a system challenge, not a people problem. ' +
        'Design 2.0 was the redesigned framework: clearer stages, stronger governance, and visibility from discovery through delivery. ' +
        'It\'s now the standard design process across Qatar Airways Digital.'
    },
    {
      tag: 'problem',
      q: ['problem', 'challenge', 'frustration', 'why', 'what was wrong', 'rework', 'system'],
      a:
        'Across teams I kept hearing the same things. Product owners felt design took too long. Designers felt requirements were unclear. ' +
        'Stakeholders joined too late. Reviews were inconsistent. Expectations shifted depending on the team. ' +
        'That meant unnecessary rework and frustration on both sides. The challenge wasn\'t individual performance — it was the system we were all working inside.'
    },
    {
      tag: 'opportunity',
      q: ['opportunity', 'goals', 'why redesign', 'what did you want', 'objectives', 'aim'],
      a:
        'I wanted a process that increased clarity and ownership, cut unnecessary rework, improved stakeholder alignment, and created consistency across teams. ' +
        'I wanted designers to feel confident about what "good" looks like, and Product, Design and Engineering to collaborate properly. ' +
        'Most importantly, I wanted something people would actually use — not shelfware.'
    },
    {
      tag: 'discovery',
      q: ['research', 'discovery', 'feedback', 'interviews', 'themes', 'patterns', 'what did you hear'],
      a:
        'I gathered feedback from designers, product owners and stakeholders across the organisation. The patterns were consistent: unclear requirements, late stakeholder feedback, limited visibility of work, inconsistent review standards, weak ownership between teams, and different ways of working across domains. ' +
        'I mapped the existing process and pinpointed the friction points that were really hurting delivery.'
    },
    {
      tag: 'creating',
      q: ['creating', 'framework', 'how did you build', 'stages', 'governance', 'checkpoints', 'handover'],
      a:
        'Design 2.0 introduced clearer stages, stronger governance and greater visibility through the whole lifecycle. ' +
        'Structured discovery, defined review checkpoints, clear stakeholder involvement, improved handovers, consistent quality standards, and accountability across teams. ' +
        'The point wasn\'t to add more process — it was to remove ambiguity.'
    },
    {
      tag: 'five-steps',
      q: ['five steps', 'sprint 0', 'walk me through', 'process steps', 'stages', 'workflow', 'ideation'],
      a:
        'We moved from Ideation → Design → QA → Launch to Sprint 0 → Design → QA → Launch → Review. ' +
        'Sprint 0 is requirements and discovery before design starts. Design is UI and UX review using shared components. ' +
        'QA is a review and handover session — visibility, fewer bottlenecks. Launch includes production and post-launch review with engineering. ' +
        'Review closes the loop with in-review learning and v2 refinement.'
    },
    {
      tag: 'impact',
      q: ['impact', 'results', 'outcomes', 'standard', 'scale', 'organisation', 'digital'],
      a:
        'Design 2.0 became the standard design process across Qatar Airways Digital. It supports designers, product owners and stakeholders across multiple teams and initiatives. ' +
        'We improved alignment, consistency, and shared understanding of how work moves from idea to delivery. ' +
        'For me as a leader, it was also proof I could drive organisational change and build something that scales beyond my direct involvement.'
    },
    {
      tag: 'reflection',
      q: ['reflection', 'lesson', 'learned', 'takeaway', 'talent', 'environment'],
      a:
        'One of the biggest lessons: great design outcomes rarely come from talent alone. They come from creating the right environment for talented people to succeed. ' +
        'Design 2.0 was never about adding more process. It was about giving teams the clarity, confidence and structure to do their best work.'
    },
    {
      tag: 'initiatives',
      q: ['initiatives', 'culture', 'workshops', 'newsletter', 'show and tell', 'accessibility'],
      a:
        'Process change doesn\'t stick on its own. We supported Design 2.0 with culture initiatives: workshops, design and accessibility ramp-up, deep dives and show-and-tell, agency collaboration, a monthly newsletter, and product alignment plus speed reviews.'
    },
    {
      tag: 'challenges-detail',
      q: ['misalignment', 'sign-off', 'trust', 'visibility', 'consistency'],
      a:
        'Underlying everything was misalignment — unclear requirements, late feedback, limited visibility, and inconsistent standards. ' +
        'Design 2.0 attacked those directly with discovery upfront, defined checkpoints, structured handovers, and a shared view of what good looks like.'
    }
  ]
};
