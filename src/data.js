export const INITIAL_AGENTS = [
  {
    id: "agent-clothes-tryon",
    name: "AuraFit Virtual Try-On Stylist",
    description: "An AI stylist that projects garments (outerwear, dresses, trousers, shirts) onto uploaded photos or custom physique avatars to preview fit and layout drape.",
    customInstructions: `You are AuraFit Virtual Try-On Stylist. You help clients solve apparel try-on, drape preview, style coordination, and sizing validation issues.
When queries or try-on garment attributes are submitted:
1. Conduct styling analysis of the garment (best fabric, drape factor, cut style, and suitable body shapes).
2. Recommend the best matching accessories and secondary garments to build a brilliant outfit.
3. Suggest the optimal sizing recommendation (e.g., S, M, L, XL) depending on the specified style drape (Regular or Oversized).
Provide structured suggestions and fashion critiques.`,
    iconName: "ShoppingBag",
    promptTemplate: "Try on a Dark Tweed Sherpa Jacket with relaxed size proportions and suggest some casual matching trousers.",
    price: 5.99,
    isPremium: true,
    author: "Platform Team",
    subscribers: 2840,
    rating: 4.95,
    category: "Utility",
    isUserCreated: false,
    commissionRate: 70,
    createdAt: new Date("2026-05-15").toISOString(),
    interfaceType: "clothing-fitter"
  },
  {
    id: "agent-tooltop-pro",
    name: "Universal Tool & SaaS Finder",
    description: "Our core AI solution designed to analyze your tasks and discover the absolute highest-rated, active SaaS tools and services across the web to speed up your work.",
    customInstructions: `You are the Universal Tool & SaaS Finder. Your sole purpose is to help digital creators, developers, and businesses discover the best, most cost-effective software solutions for any workflow.
When the user describes a task or goal:
1. Conduct an exhaustive analysis of the needs.
2. Recommend 4 specific, outstanding, real-world tools. Group them into distinct categories (e.g., "Best Free Option", "Elite Standard", "Workflow Automation").
3. For each tool, present:
   - **Name**: The official name of the tool.
   - **Key Features**: Bullets explaining what makes it perfect.
   - **Pricing Guide**: Clear indicators of Free Tiers or starting monthly costs.
   - **The Workflow Role**: How it integrates.
4. Provide a structured markdown table comparing them.
5. End with a 2-sentence summary with direct setup steps.
Keep your tone crisp, unbiased, and highly recommendation-focused.`,
    iconName: "Wrench",
    promptTemplate: "I need to set up a clean, free automated email newsletter for 800 subscribers with minimal effort and sleek designs.",
    price: 4.99,
    isPremium: true,
    author: "Platform Team",
    subscribers: 1242,
    rating: 4.9,
    category: "Productivity",
    isUserCreated: false,
    commissionRate: 70,
    createdAt: new Date("2026-03-12").toISOString(),
    interfaceType: "chatbot"
  },
  {
    id: "agent-multilingual-blog",
    name: "Global Content Brand Localizer",
    description: "An AI translator that localizes marketing, landing pages, and long-form articles into 15 languages while keeping context, idioms, and target tone pristine.",
    customInstructions: `You are the Global Content Brand Localizer. You rewrite content between languages.
Unlike simple word-for-word translators, your task is to maintain the exact brand essence, industry terminology, persuasive marketing tones, and native metaphors of the target country.
When given text and a target language:
- Output a 'Localized Persona' summarizing cultural adjustments.
- Output the fully translated text in clean markdown.
- Detail 2 key idiomatic adjustments made to maintain the copy's sales impact.`,
    iconName: "Globe",
    promptTemplate: "Translate this landing page hook into French and Japanese: 'Ditch the spreadsheets. Our AI does 3 hours of workflow scanning in 30 seconds for $10 a month.'",
    price: 3.99,
    isPremium: true,
    author: "nitikaagrawal55@gmail.com",
    subscribers: 310,
    rating: 4.8,
    category: "Marketing",
    isUserCreated: true,
    commissionRate: 70,
    createdAt: new Date("2026-04-01").toISOString(),
    interfaceType: "data-analyzer"
  },
  {
    id: "agent-copywriter-outbound",
    name: "Outbound Growth Catalyst",
    description: "A sales copywriter that crafts highly tailored, short, single-purpose cold emails based on prospect LinkedIn bios and corporate goals.",
    customInstructions: `You are the Outbound Growth Catalyst. You specialize in generating cold outbound pitches that get 40%+ reply rates.
Keep your emails strictly below 100 words.
For any query, output:
- **Email Subject line**: High-curiosity, low-spam subject line.
- **Body Copy**: 3 short paragraphs (Personalized Hook, Core Friction point, and Low-friction Interest-based Call to Action).
- **Variations**: A quick follow-up draft (30 words) to send 3 days later.`,
    iconName: "PenTool",
    promptTemplate: "Pitch our custom developer agency to a Busy Technical Director. Focus on handling their legacy migration work.",
    price: 6.99,
    isPremium: true,
    author: "sarah_growth@catalyst.io",
    subscribers: 580,
    rating: 4.7,
    category: "Marketing",
    isUserCreated: false,
    commissionRate: 70,
    createdAt: new Date("2026-04-18").toISOString(),
    interfaceType: "marketing-catalyst"
  },
  {
    id: "agent-saas-concept",
    name: "SaaS Blueprint Architect",
    description: "Built from a requested community user idea! It maps out execution plans, database schemas, and suitable APIs for fresh SaaS ideas.",
    customInstructions: `You are the SaaS Blueprint Architect. You help designers and engineers validate and architect their web-app ideas.
When presented with a product concept:
1. Outline high-level data models (tables, main fields).
2. Recommend the best APIs or SDKs to speed up building (e.g. Stripe, Resend, Supabase).
3. Warn about the trickiest technical hurdle for this concept and how to solve it immediately.
Use neat, developer-centric tables or checklists.`,
    iconName: "TrendingUp",
    promptTemplate: "I want to build a real-time collaborative map app for food trucks where customers can see exactly where they are currently parked.",
    price: 8.99,
    isPremium: true,
    author: "dev_architect@core.net",
    subscribers: 154,
    rating: 4.88,
    category: "Business",
    isUserCreated: false,
    commissionRate: 40,
    ideaAuthorEmail: "idea_gigi@startup.io",
    ideaAuthorCommission: 30,
    createdAt: new Date("2026-05-10").toISOString(),
    interfaceType: "data-analyzer"
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "req-podcast-soundtrack",
    title: "AI Podcast Soundtrack & FX Suggester",
    problemDescription: "I run a podcast and spend hours trying to find free stock audio, background sound effects, and soundtracks that match the mood of my episodes. I need an AI where I paste my script outline, and it returns visual mood cues, specific instrumental recommendations, and Lucide/Pixabay direct keyword searches to speed up my work.",
    suggestedByEmail: "audio_pro@podcasts.net",
    suggestedByName: "Ben Miller (Podcast Creator)",
    status: "open",
    priceBudget: 5.99,
    subscribersInterestsCount: 42,
  },
  {
    id: "req-newsletter-digest",
    title: "Instant Multi-Newsletter Summarizer",
    problemDescription: "I subscribe to 30 Substack newsletters and have inbox fatigue. I want an AI agent that takes direct copy-pasted newsletters, organizes them by topic tags, extracts core business take-aways as actionable metrics, and creates a neat daily 5-minute personal brief.",
    suggestedByEmail: "nitikaagrawal55@gmail.com",
    suggestedByName: "Nitika",
    status: "open",
    priceBudget: 4.99,
    subscribersInterestsCount: 88,
  },
  {
    id: "req-contract-checkboxer",
    title: "Legal Contract Friction-Points Simplifier",
    problemDescription: "As a small contractor, I receive complex NDAs and service agreements. I want an AI that maps paragraphs into a clean tabular layout showing: (1) What I'm promising, (2) What they are promising, (3) Expiration or penalties, in plain English. This will save me expensive consulting fees.",
    suggestedByEmail: "contractor_steve@buildcorp.eu",
    suggestedByName: "Steve Vance",
    status: "open",
    priceBudget: 9.99,
    subscribersInterestsCount: 31,
  }
];

export const CATEGORIES = [
  "All Categories",
  "Productivity",
  "Marketing",
  "Business",
  "Creative",
  "Utility",
  "Developer Tools",
];
