interface Mission {
  text: string;
}

interface TargetAudience {
  primary: string[];
  leverage: string;
}

interface CoreProblem {
  reality: string;
  consequence: string;
}

interface SolutionFeature {
  title: string;
  description: string;
}

interface Solution {
  features: SolutionFeature[];
  impacts: string[];
}

interface ValueProp {
  text: string;
}

interface BrandPersonality {
  tone: string[];
  colors: string[];
}

interface LandingPageSection {
  id: string;
  title: string;
  content: string;
  painPoints?: string[];
  featureList?: string[];
}

const serveSync = {
  mission: {
    text: "Automate hospitality operations so owners can reclaim their time and grow",
  },

  targetAudience: {
    primary: [
      "Independent restaurant owners",
      "Boutique hotel managers",
      "Multi-location hospitality operators",
    ],
    leverage:
      "Labor is their highest expense — saving 10-15 hours of admin per week makes ServeSync a high-ROI decision.",
  },

  coreProblem: {
    reality:
      "Hospitality managers are trapped in low-leverage manual administration — juggling shifts, schedules, supplier inventory, repetitive guest inquiries, and daily checklists through clipboards or messy group chats.",
    consequence:
      "High operational friction, costly inventory waste, human error in scheduling, manager burnout, and zero time left for strategic revenue‑driving initiatives.",
  },

  solution: {
    features: [
      {
        title: "Smart Scheduling & Communication",
        description:
          "AI generates shifts based on historical sales trends and weather, automatically handling staff swaps and messaging.",
      },
      {
        title: "Automated Inventory & Waste Alerts",
        description:
          "Scans invoices, tracks stock levels, and sends predictive alerts before items run out or spoil.",
      },
      {
        title: "Daily Task Automation",
        description:
          "Automatically assigns and tracks opening/closing checklists, temperature logs, and compliance tasks.",
      },
      {
        title: "Work-Life Balance",
        description:
          "Cuts administrative overhead by up to 70%, allowing managers to actually step away from the business.",
      },
      {
        title: "Revenue Growth",
        description:
          "Reduces labor overspending, minimizes food/supply waste, and ensures zero missed customer inquiries.",
      },
    ],
    impacts: [
      "Less paperwork",
      "Zero waste",
      "Hours back in your day",
      "Reduced burnout",
      "Higher operational efficiency",
    ],
  },

  valueProp: {
    text: "Your AI back-office co-pilot — less paperwork, zero waste, and hours back in your day.",
  },

  brandPersonality: {
    tone: ["professional", "classic", "calm"],
    colors: ["#3C2A21", "#89CFF0"],
  },

  landingPage: [
    {
      id: "hero",
      title: "ServeSync — Hospitality Runs Smoother Here",
      content:
        "Automate operations, eliminate burnout, and reclaim hours of your day with your AI back-office co-pilot.",
    },
    {
      id: "problem",
      title: "The Problem",
      content:
        "Hospitality managers are drowning in manual admin, chaotic scheduling, inventory waste, and repetitive guest inquiries.",
      painPoints: [
        "Chaotic scheduling and shift swaps",
        "Inventory waste due to poor tracking",
        "Repetitive guest inquiries draining time",
        "Daily checklists scattered across chats and clipboards",
        "Zero time left for strategic growth",
      ],
    },
    {
      id: "solution",
      title: "The Solution",
      content:
        "ServeSync automates scheduling, inventory, daily tasks, and communication — giving operators clarity, control, and time.",
    },
    {
      id: "features",
      title: "Features",
      content:
        "Smart scheduling, automated inventory alerts, daily task automation, and revenue-driving operational insights.",
      featureList: [
        "AI-powered scheduling",
        "Predictive inventory alerts",
        "Automated daily checklists",
        "Smart communication tools",
        "Operational insights dashboard",
      ],
    },
    {
      id: "value",
      title: "Why ServeSync",
      content:
        "Less paperwork, zero waste, and hours back in your day — all powered by AI.",
    },
  ],
};

export default serveSync;