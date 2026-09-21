/**
 * Google Gemini API Integration for User Personaa
 * Generates rich, realistic user personas using Gemini models with structured JSON output.
 */

export const EXAMPLE_PROMPTS = [
  {
    chip: '"Busy remote working parent who struggles with me..."',
    prompt:
      "Busy remote working parent who struggles with meal planning, school schedules, and finding time for healthy family routines while juggling full-time remote meetings",
  },
  {
    chip: '"Junior frontend developer who feels overwhelmed ..."',
    prompt:
      "Junior frontend developer who feels overwhelmed by complex state management, rapidly changing design system tokens, and unclear acceptance criteria in sprint backlog",
  },
  {
    chip: '"B2B sales director who needs clear pipeline visi..."',
    prompt:
      "B2B sales director who needs clear pipeline visibility, accurate quarterly revenue forecasts, and automated CRM updates to prevent deal slippage across their distributed team",
  },
  {
    chip: '"College student managing study schedules, part-t..."',
    prompt:
      "College student managing study schedules, part-time campus shifts, and tight exam deadlines while trying to balance mental wellbeing and group project coordination",
  },
  {
    chip: '"Eco-conscious shopper trying to verify product s..."',
    prompt:
      "Eco-conscious shopper trying to verify product sustainability, ethical supply chain credentials, and recyclable packaging claims before making online purchase decisions",
  },
];

const PRESET_FALLBACK_PERSONAS = {
  parent: {
    name: "Rachel Hayes",
    role: "Remote Working Parent & Operations Lead",
    age: 36,
    category: "Family & Remote Work",
    avatar: "./avatars/avatar-3.png",
    bio: "Full-time operations manager navigating remote work while coordinating daily schedules and meal routines for two school-age children.",
    quote: '"Between back-to-back team syncs and dinner time, I need digital tools that save hours, not add chores."',
    painPoints: [
      "Meal planning and grocery coordination colliding with chaotic sprint weeks",
      "Managing fragmented school calendars and unexpected extracurricular changes",
      "Mental exhaustion from constant context-switching between work and family duties",
      "Lack of shared digital hubs combining domestic tasks with personal priorities",
    ],
    motivations: [
      "Protecting uninterrupted family evenings without work notifications spilling over",
      "Automating recurring meal prep and grocery reorder routines",
      "Maintaining predictable daily rhythms and homework structures for the kids",
      "Preserving personal time for mental clarity and exercise",
    ],
    goals: [
      "Cut weekly meal coordination time by 4 hours through automated planning",
      "Consolidate family and school schedules into a single frictionless board",
    ],
  },
  developer: {
    name: "Liam Patel",
    role: "Junior Frontend Engineer",
    age: 24,
    category: "Engineering & Dev",
    avatar: "./avatars/avatar-8.png",
    bio: "Passionate self-taught developer navigating modern React architecture, agile sprint cadences, and design handoffs in a fast-paced product squad.",
    quote: '"I want to spend my sprint building solid components, not guessing what acceptance criteria meant."',
    painPoints: [
      "Ambiguous card descriptions lacking clear acceptance criteria or mock links",
      "Friction integrating state management with rapidly changing Figma tokens",
      "Imposter syndrome when asking senior engineers for debugging help",
      "Discrepancies between approved design files and delivered code releases",
    ],
    motivations: [
      "Writing clean, accessible frontend code that passes PR reviews on the first pass",
      "Growing technical autonomy and mastering component architecture",
      "Having crisp persona context on tickets to understand real user needs",
      "Contributing actively to team retrospectives and design system docs",
    ],
    goals: [
      "Halve time spent clarifying ticket scope by having rich persona context on cards",
      "Attain mid-level engineer benchmark within 12 months",
    ],
  },
  sales: {
    name: "Victoria Stone",
    role: "B2B Sales Director",
    age: 41,
    category: "Revenue & Sales",
    avatar: "./avatars/avatar-16.png",
    bio: "Strategic revenue leader driving enterprise sales cycles, managing multi-tier pipelines, and mentoring account executives across three continents.",
    quote: '"A missed follow-up is a lost account. Visibility and momentum are everything."',
    painPoints: [
      "Fragmented deal stages across outdated CRM logs, Slack, and email threads",
      "Unreliable quarterly forecasts due to manual pipeline updates by reps",
      "Difficulty aligning customer pain points with product team feature roadmaps",
      "Deal slippage caused by slow response times during complex RFP reviews",
    ],
    motivations: [
      "Surpassing annual recurring revenue quotas with predictable pipeline velocity",
      "Equipping sales reps with instant customer empathy insights during discovery calls",
      "Automating low-value CRM administrative entry to maximize customer facing time",
      "Aligning product priorities with high-value prospect feature requests",
    ],
    goals: [
      "Shorten enterprise deal cycles by 18% with synchronized board tracking",
      "Achieve 95% pipeline forecast accuracy across all remote territories",
    ],
  },
  student: {
    name: "Samira Khan",
    role: "Computer Science Undergraduate & Campus Tutor",
    age: 21,
    category: "Academic & Campus",
    avatar: "./avatars/avatar-9.png",
    bio: "Third-year university student balancing heavy course loads, part-time campus lab assistant hours, and student club leadership.",
    quote: '"I don\'t need more notifications—I need a clean dashboard that tells me what to tackle next."',
    painPoints: [
      "Deadlines overlapping between exam weeks, lab submissions, and tutoring shifts",
      "Cluttered group project chats where deliverables and action items get buried",
      "Stress and cognitive overload from fragmented syllabus schedules across multiple portals",
      "Difficulty sustaining study momentum alongside sleep and self-care",
    ],
    motivations: [
      "Maintaining high academic standing to qualify for competitive summer internships",
      "Keeping study groups organized with clear task assignments and deadlines",
      "Minimizing late-night cramming through steady weekly milestone tracking",
      "Building a strong project portfolio to present to tech recruiters",
    ],
    goals: [
      "Complete major coursework assignments 48 hours prior to final submission",
      "Secure a top-tier software engineering internship for the upcoming summer",
    ],
  },
  eco: {
    name: "Oliver Green",
    role: "Sustainable Lifestyle Researcher & Conscious Consumer",
    age: 29,
    category: "Consumer & Sustainability",
    avatar: "./avatars/avatar-14.png",
    bio: "Digital consumer advocate committed to zero-waste principles, analyzing supply chain transparency and ethical consumer goods.",
    quote: '"Green claims mean nothing without transparent data and verifiable sourcing."',
    painPoints: [
      "Misleading greenwashing claims and vague carbon neutrality statements",
      "Difficulty verifying lifecycle recyclability and plastic-free packaging specs",
      "Time wasted digging through fine print to confirm cruelty-free certifications",
      "Higher price premiums on products that fail to deliver durable quality",
    ],
    motivations: [
      "Supporting ethical brands that publish open supply chain and carbon footprint audits",
      "Reducing personal household plastic waste and landfill impact",
      "Inspiring friends and community members through vetted sustainable recommendations",
      "Demanding radical accountability from major retailers and consumer packaged goods",
    ],
    goals: [
      "Verify 100% of household repeat purchases against independent ethical standards",
      "Eliminate single-use plastic packaging from monthly online orders",
    ],
  },
};

/**
 * Extracts best matching avatar from available preset list
 */
function pickAvatar(roleOrName = "", avatarPack = []) {
  if (!avatarPack || avatarPack.length === 0) return "./avatars/avatar-3.png";
  const str = roleOrName.toLowerCase();
  if (str.includes("parent") || str.includes("family") || str.includes("rachel") || str.includes("maya")) {
    return avatarPack[0]?.url || "./avatars/avatar-3.png";
  }
  if (str.includes("lead") || str.includes("tech") || str.includes("marcus") || str.includes("director")) {
    return avatarPack[1]?.url || "./avatars/avatar-2.png";
  }
  if (str.includes("student") || str.includes("samira") || str.includes("chloe") || str.includes("glasses")) {
    return avatarPack[2]?.url || "./avatars/avatar-9.png";
  }
  if (str.includes("dev") || str.includes("engineer") || str.includes("liam") || str.includes("alex")) {
    return avatarPack[3]?.url || "./avatars/avatar-8.png";
  }
  if (str.includes("designer") || str.includes("elena") || str.includes("ux")) {
    return avatarPack[4]?.url || "./avatars/avatar-12.png";
  }
  if (str.includes("admin") || str.includes("kim") || str.includes("ops")) {
    return avatarPack[5]?.url || "./avatars/avatar-11.png";
  }
  if (str.includes("eco") || str.includes("oliver") || str.includes("shopper") || str.includes("sophia")) {
    return avatarPack[8]?.url || "./avatars/avatar-14.png";
  }
  if (str.includes("sales") || str.includes("stone") || str.includes("victoria") || str.includes("suit")) {
    return avatarPack[9]?.url || "./avatars/avatar-16.png";
  }
  // Random hash fallback
  const charCode = (roleOrName.charCodeAt(0) || 0) % avatarPack.length;
  return avatarPack[charCode]?.url || "./avatars/avatar-3.png";
}

/**
 * Intelligent semantic generator for offline / fallback / demo mode
 */
export function generateLocalPersona(userPrompt = "", avatarPack = []) {
  const p = userPrompt.toLowerCase();

  let matched = null;
  if (p.includes("parent") || p.includes("meal") || p.includes("family") || p.includes("school")) {
    matched = PRESET_FALLBACK_PERSONAS.parent;
  } else if (p.includes("frontend") || p.includes("developer") || p.includes("junior") || p.includes("state management") || p.includes("figma")) {
    matched = PRESET_FALLBACK_PERSONAS.developer;
  } else if (p.includes("sales") || p.includes("b2b") || p.includes("pipeline") || p.includes("crm") || p.includes("forecast")) {
    matched = PRESET_FALLBACK_PERSONAS.sales;
  } else if (p.includes("student") || p.includes("study") || p.includes("college") || p.includes("exam") || p.includes("adhd")) {
    matched = PRESET_FALLBACK_PERSONAS.student;
  } else if (p.includes("eco") || p.includes("sustainable") || p.includes("shopper") || p.includes("supply chain")) {
    matched = PRESET_FALLBACK_PERSONAS.eco;
  }

  const roleClean = userPrompt.trim().replace(/^["']|["']$/g, "");
  const baseName = matched ? matched.name : "Alex Rivera";
  const baseRole = matched ? matched.role : (roleClean.length > 5 ? roleClean.split("who")[0].trim() : "Product Strategist");
  const baseAvatar = matched ? matched.avatar : pickAvatar(roleClean, avatarPack);

  return {
    id: `persona-ai-${Date.now()}`,
    name: baseName,
    role: baseRole,
    age: matched ? matched.age : 32,
    category: matched ? matched.category : "Core User",
    avatar: baseAvatar,
    bio: matched
      ? matched.bio
      : `Active professional focusing on ${roleClean || "optimized workflows"}, balancing high execution velocity with clean team collaboration.`,
    quote: matched
      ? matched.quote
      : `"Solving real user friction in ${roleClean.slice(0, 30) || "our workflow"} unlocks true product value."`,
    painPoints: matched
      ? [...matched.painPoints]
      : [
          `Repetitive, manual friction in day-to-day ${roleClean.slice(0, 40) || "operations"}`,
          "Unclear requirements or missing user empathy in sprint task descriptions",
          "Fragmented communication scattered across emails, chat channels, and spreadsheets",
          "Slow feedback loops when validating delivered features with real target users",
        ],
    motivations: [
      `Streamlining end-to-end workflows for ${roleClean.slice(0, 40) || "our users"}`,
      "Embedding clear user empathy directly onto Trello cards and project tickets",
      "Validating requirements with quantitative data and live feedback loops",
      "Fostering cross-functional alignment between engineering, design, and business squads",
    ],
    goals: matched
      ? [...matched.goals]
      : [
          `Eliminate top 3 workflow bottlenecks in ${roleClean.slice(0, 30) || "daily operations"}`,
          "Foster 100% card context alignment across active project boards",
        ],
    attachedCardsCount: 1,
    attachedMembers: ["AI", "GEM"],
  };
}

/**
 * Generates a Persona using Google Gemini API with fallback to local synthesizer
 *
 * @param {string} userPrompt - User prompt describing archetype / problem space
 * @param {Array} avatarPack - Preset avatar pack for avatar assignment
 * @param {string} customApiKey - Optional override API key
 * @returns {Promise<Object>} Formatted Persona object
 */
export async function generatePersonaWithGemini(userPrompt, avatarPack = [], customApiKey = "") {
  const apiKey =
    customApiKey ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem("user_persona_gemini_api_key") ||
    "";

  // If no API key provided, immediately use rich local synthesizer
  if (!apiKey || apiKey === "your_actual_gemini_api_key_here") {
    console.info("[User Personaa AI] No Gemini API key detected. Using built-in semantic synthesizer.");
    // Simulate brief network latency for realistic AI experience
    await new Promise((resolve) => setTimeout(resolve, 800));
    return generateLocalPersona(userPrompt, avatarPack);
  }

  const systemInstruction = `You are an expert UX Researcher, Product Manager, and Design Strategist.
Given a user archetype, role, or problem description, generate a detailed, realistic user persona in valid JSON format.
The JSON object must strictly match this schema:
{
  "name": "Full human name (e.g. Rachel Hayes, Liam Patel, Marcus Vance)",
  "role": "Concise professional title or archetype role",
  "age": 28,
  "category": "High level archetype category (e.g. Core Designer, Tech Lead, Family & Remote Work, Revenue & Sales, Academic)",
  "bio": "2 to 3 sentence realistic narrative explaining their context, daily workflow, and lifestyle.",
  "quote": "A punchy, empathetic first-person statement in quotation marks summarizing their core frustration or mindset.",
  "painPoints": [
    "Specific pain point 1",
    "Specific pain point 2",
    "Specific pain point 3",
    "Specific pain point 4"
  ],
  "motivations": [
    "Core motivation 1",
    "Core motivation 2",
    "Core motivation 3",
    "Core motivation 4"
  ],
  "goals": [
    "Quantifiable, concrete goal 1",
    "Quantifiable, concrete goal 2"
  ]
}
Return ONLY the raw JSON object without markdown formatting or code blocks.`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${systemInstruction}\n\nUSER PROMPT / PROBLEM SPACE:\n"${userPrompt}"`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      responseMimeType: "application/json",
    },
  };

  // Primary model is gemini-3.8-flash, with fallback to 3.5-flash-lite, 3.1-flash-lite, or 3.5-flash
  const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[User Personaa AI] ${model} failed (${response.status}):`, errorText);
        lastError = new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No text returned by Gemini");
      }

      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(rawText.trim());
      } catch {
        // Remove codeblock wrappers if any
        const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      const avatarUrl = pickAvatar(parsed.role || parsed.name || userPrompt, avatarPack);

      return {
        id: `persona-ai-${Date.now()}`,
        name: parsed.name || "Alex Rivera",
        role: parsed.role || userPrompt.slice(0, 40),
        age: typeof parsed.age === "number" ? parsed.age : 30,
        category: parsed.category || "Target Audience",
        avatar: avatarUrl,
        bio: parsed.bio || `Created based on prompt: "${userPrompt}".`,
        quote: parsed.quote || `"Building with user empathy creates products that last."`,
        painPoints: Array.isArray(parsed.painPoints) && parsed.painPoints.length > 0
          ? parsed.painPoints.slice(0, 4)
          : ["Lack of clear card acceptance criteria", "Friction with repetitive tasks"],
        motivations: Array.isArray(parsed.motivations) && parsed.motivations.length > 0
          ? parsed.motivations.slice(0, 4)
          : ["Shipping high quality deliverables", "Optimizing sprint efficiency"],
        goals: Array.isArray(parsed.goals) && parsed.goals.length > 0
          ? parsed.goals.slice(0, 2)
          : ["Reduce workflow friction by 20%", "Improve board empathy across the team"],
        attachedCardsCount: 1,
        attachedMembers: ["AI", "GEM"],
      };
    } catch (err) {
      console.warn(`[User Personaa AI] Error calling ${model}:`, err);
      lastError = err;
    }
  }

  // If all Gemini network attempts fail, use robust local fallback
  console.warn("[User Personaa AI] Falling back to local semantic synthesizer:", lastError?.message);
  return generateLocalPersona(userPrompt, avatarPack);
}
