/**
 * IMSHI — AI project context
 * Visual: Imshi.html editorial case study
 */
window.PORTFOLIO_PROJECTS = window.PORTFOLIO_PROJECTS || {};

window.PORTFOLIO_PROJECTS.imshi = {
  id: 'imshi',
  title: 'IMSHI',
  summary:
    'IMSHI is a Qatar-focused car marketplace mobile app for automotive enthusiasts. ' +
    'It combines a 49,806-variant vehicle catalog across 146 makes with Firebase-backed live listings, ' +
    'dynamic filters scoped to real vehicle data, and a three-step sell flow — all in a clean monochrome Expo app.',
  systemPrompt:
    'You are answering as Adil Ahmad about IMSHI, his Qatar car marketplace app. ' +
    'Emphasise cars-only positioning, catalog-backed pickers, dynamic filters, Firebase stack, and mobile UX. ' +
    'Answer in first person when describing Adil\'s work. Be conversational, not corporate. Do not use em dashes.',
  greeting:
    'Ask me about IMSHI — the marketplace concept, vehicle catalog, dynamic filters, or tech stack.',
  starters: [
    'What is IMSHI?',
    'How does the vehicle catalog work?',
    'What tech stack did you use?',
    'How do dynamic filters work?'
  ],
  fullContext: [
    'IMSHI | Qatar car marketplace | v1.0 | Expo React Native.',
    'Tagline: A car marketplace for petrol heads — browse, list, and connect without clutter.',
    'Positioning: Cars only. No jobs, property, or mixed categories. Monochrome UI on #F3F2F1 screens.',
    'Catalog: 49,806 vehicle variants across 146 makes. Static JSON on Firebase Hosting. Lazy per-make load. AsyncStorage cache until version bump.',
    'Filters: Engine size, fuel type, transmission, doors, body type — all dynamic based on selected make/model/variant from catalog data.',
    'Tabs: Home (search widget + body types + recently listed), Search, Add (3-step listing), Saved, Profile.',
    'Listings: Firestore — active listings, saved items, user profiles. Cloud Functions for search. QAR pricing.',
    'Auth: Firebase — email, Google, Qatar phone format, anonymous guest browse bridge.',
    'Contact: WhatsApp pre-filled message + phone call from listing detail — no in-app messaging.',
    'Listing lifecycle: 7-day preview + 7-day grace period, auto-removal via scheduled Cloud Function (Asia/Qatar).',
    'Tech: React Native 0.81, Expo SDK 54, Expo Router 6, TypeScript, Firebase Auth/Firestore/Hosting, design tokens.',
    'Adil\'s role: Product design, mobile UX, catalog architecture, frontend engineering leadership.'
  ].join('\n\n'),
  sections: [
    {
      tag: 'overview',
      q: ['imshi', 'what is', 'overview', 'marketplace', 'qatar', 'car', 'automotive'],
      a:
        'IMSHI is my Qatar car marketplace — built for people who care about cars. ' +
        'It is cars only: browse with catalog-backed filters, save listings, list your own vehicle in three steps, and contact sellers in QAR. ' +
        'No clutter from generic classifieds platforms.'
    },
    {
      tag: 'catalog',
      q: ['catalog', 'vehicle', 'makes', 'variants', '49806', '146', 'json', 'hosting'],
      a:
        'The vehicle catalog has 49,806 variants across 146 makes — Toyota, BMW, Mercedes, and everything in between. ' +
        'It lives as static JSON on Firebase Hosting (not Firestore reads), lazy-loaded per make, cached on device until the catalog version bumps. ' +
        'That powers pickers, filter options, and listing forms from one source of truth.'
    },
    {
      tag: 'filters',
      q: ['filter', 'dynamic', 'engine', 'fuel', 'transmission', 'search'],
      a:
        'Filters are dynamic: if you pick Bugatti Chiron, you will not see a 1.0L engine option because the catalog does not have one. ' +
        'Engine, fuel, transmission, and body options all scope to the selected make and model. ' +
        'Homepage and search screens share the same logic with auto-reset when a parent selection changes.'
    },
    {
      tag: 'contact',
      q: ['contact', 'whatsapp', 'call', 'seller', 'message', 'chat'],
      a:
        'Seller contact is deliberate and lightweight — tap WhatsApp for a pre-filled message with the listing details, or call directly. ' +
        'There is no in-app chat; the goal is to get buyers talking to real sellers fast, not to rebuild messaging infrastructure.'
    },
    {
      tag: 'listings',
      q: ['expiry', 'preview', 'grace', 'renew', 'sold', 'days', 'lifecycle'],
      a:
        'Listings run on a 7-day preview window plus a 7-day grace period, with daily cleanup in Qatar timezone. ' +
        'Sellers see days remaining in profile, can renew, or mark sold. Expired listings drop out of search server-side.'
    },
    {
      tag: 'sell',
      q: ['sell', 'list', 'add', 'listing', 'upload', 'photos', 'inspection'],
      a:
        'Selling is a three-step flow: vehicle identity from the catalog, specs like mileage and transmission, then photos and location. ' +
        'There is an inspection report CTA, QAR price formatting, confetti on publish, and listings go live on Firestore with the 7+7 day lifecycle.'
    },
    {
      tag: 'tech',
      q: ['tech', 'stack', 'react native', 'expo', 'firebase', 'typescript', 'built with'],
      a:
        'Built with React Native and Expo SDK 54, Expo Router for navigation, TypeScript throughout. ' +
        'Firebase Auth for sign-in (including guest browse), Firestore for listings and saved items, Firebase Hosting for the static catalog. ' +
        'Custom design tokens and a component library — AppButton, VehicleCard, full-screen drawers for make/model.'
    },
    {
      tag: 'design',
      q: ['design', 'ui', 'ux', 'figma', 'monochrome', 'drawer'],
      a:
        'The UI is intentionally monochrome — black and white on warm grey screens. ' +
        'Make and model use full-screen drawers, not native dropdowns. ' +
        'Body-type shortcuts on the homepage, live listing counts on picker chips, skeleton loaders, and haptics on key actions.'
    },
    {
      tag: 'role',
      q: ['role', 'adil', 'your work', 'led', 'designed'],
      a:
        'I led product design and frontend engineering on IMSHI — catalog architecture, mobile UX from Figma, the dynamic filter system, ' +
        'and the Expo app shell that ties catalog data to live Firestore listings.'
    }
  ]
};
