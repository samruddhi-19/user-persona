// Curated 10 Flat Vector Avatars
export const FLAT_AVATARS_PACK = [
  { id: "flat-1", name: "Maya Lin (Amber / Ponytail)", url: "./avatars/avatar-3.png" },
  { id: "flat-2", name: "Marcus Vance (Salmon / Tech Lead)", url: "./avatars/avatar-2.png" },
  { id: "flat-3", name: "Chloe Chen (Teal / Glasses)", url: "./avatars/avatar-9.png" },
  { id: "flat-4", name: "Alex Rivera (Cyan / Beard & Glasses)", url: "./avatars/avatar-8.png" },
  { id: "flat-5", name: "Elena Rostova (Blue / Curly Hair)", url: "./avatars/avatar-12.png" },
  { id: "flat-6", name: "David Kim (Blue / Short Hair)", url: "./avatars/avatar-11.png" },
  { id: "flat-7", name: "Sarah Jenkins (Sky Blue / Bob)", url: "./avatars/avatar-5.png" },
  { id: "flat-8", name: "Jordan Lee (Purple / Blond Beard)", url: "./avatars/avatar-4.png" },
  { id: "flat-9", name: "Sophia Martinez (Mint / Bangs)", url: "./avatars/avatar-14.png" },
  { id: "flat-10", name: "Robert Vance (Slate / Suit)", url: "./avatars/avatar-16.png" },
];

export const PRESET_AVATARS = FLAT_AVATARS_PACK;
export const REAL_FACES_PACK = FLAT_AVATARS_PACK;

// Standard sample personas provided out-of-the-box
export const SAMPLE_PERSONAS = [
  {
    id: "persona-maya-lin",
    name: "Maya Lin",
    role: "Senior Product Designer",
    age: 31,
    category: "Core Designer",
    avatar: "./avatars/avatar-3.png",
    bio: "Senior UX architect balancing enterprise design systems with fast sprint cycles across cross-functional product squads.",
    quote: '"If engineering doesn\'t know who they are building for, the feature is already at risk."',
    painPoints: [
      "Disconnected user feedback scattered across Jira, Slack, and emails",
      "Features getting built without clear user empathy or target audience context",
      "Lack of quick persona visibility inside day-to-day sprint cards",
      "Misalignment between UX wireframes and delivered engineering releases",
    ],
    motivations: [
      "Advocating for the end-user throughout every engineering ticket",
      "Streamlining cross-functional handoffs with clear persona anchors",
      "Validating design iterations with quantitative survey evidence",
      "Fostering shared customer understanding across product and dev teams",
    ],
    goals: [
      "Deliver cohesive user flows that reduce onboarding churn by 25%",
      "Embed persona empathy directly into technical backlog planning",
    ],
    attachedCardsCount: 0,
    attachedMembers: [],
  },
  {
    id: "persona-marcus-vance",
    name: "Marcus Vance",
    role: "Engineering Team Lead",
    age: 42,
    category: "Technical Leader",
    avatar: "./avatars/avatar-2.png",
    bio: "Full-stack lead focusing on scalable microservices, CI/CD pipeline stability, and clean agile sprint execution.",
    quote: '"Clear context in the card means fewer meetings and faster commits."',
    painPoints: [
      "Vague user stories with no indication of why a feature matters to users",
      "Scope creep caused by shifting requirements mid-sprint",
      "Complex tool switching between analytics dashboards and ticket boards",
      "Late-stage rework due to ambiguous acceptance criteria",
    ],
    motivations: [
      "Shipping clean, maintainable architecture on predictable timelines",
      "Empowering engineers with high-context task descriptions",
      "Eliminating ambiguity in bug tickets and user story cards",
      "Reducing sync meetings through self-documenting agile workflows",
    ],
    goals: [
      "Maintain 99.9% sprint delivery accuracy with zero blocker ambiguities",
      "Reduce developer context-switching through self-contained Trello tickets",
    ],
    attachedCardsCount: 0,
    attachedMembers: [],
  },
  {
    id: "persona-chloe-nguyen",
    name: "Chloe Nguyen",
    role: "Growth Marketer & Customer Success",
    age: 27,
    category: "Growth & Retention",
    avatar: "./avatars/avatar-9.png",
    bio: "Cross-functional marketer and customer feedback specialist tracking retention cohorts, onboarding funnels, and feature adoption.",
    quote: '"Every user ticket tells a story — we need to design for the human behind the metrics."',
    painPoints: [
      "High drop-off rates during initial user onboarding flows",
      "Lack of real-time visibility into customer sentiment shifts",
      "Fragmented data pipelines between marketing and development",
      "Difficulty prioritizing feature requests based on actual user impact",
    ],
    motivations: [
      "Empowering cross-functional teams with data-backed user insights",
      "Bridging the gap between marketing analytics and agile backlogs",
      "Championing seamless onboarding and retention experiences",
      "Iterating quickly based on direct qualitative user feedback",
    ],
    goals: [
      "Increase trial-to-paid conversion by fixing top 5 UI bottlenecks",
      "Unify survey feedback into weekly agile sprint prioritizations",
    ],
    attachedCardsCount: 0,
    attachedMembers: [],
  },
];
