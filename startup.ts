export interface Segment {
  name: string;
  detail: string;
}

export interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

export interface ExtraAutomation {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  audience: string;
  price: string;
  cadence: string;
  lineItems: string[];
  highlight?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

const serveSync = {
  brand: {
    name: "ServeSync",
    tagline: "Hospitality Runs Smoother Here",
  },

  mission: {
    text: "Give hospitality operators their time, their margin, and their evenings back — by automating the admin nobody has time for.",
  },

  segments: [
    { name: "Family restaurants", detail: "One site, tight crew, no back office" },
    { name: "Full-service & QSR", detail: "Higher volume, tighter margins" },
    { name: "Multi-location groups", detail: "Consistency across every site" },
    { name: "Cafés & coffee shops", detail: "Fast turns, thin staffing" },
    { name: "Shopping centers", detail: "Shared services across tenants" },
  ] as Segment[],

  coreProblem: {
    reality:
      "Every week you re-type the same shift schedule, re-count the same stockroom, chase the same invoices, and re-explain the same closing checklist — hours that never make it back to you.",
    consequence:
      "That's not admin, that's a second unpaid job stacked on top of running the business. It shows up as spoiled stock, overtime you didn't approve, and evenings spent on a laptop instead of at home.",
  },

  pillars: [
    {
      id: "time",
      label: "Time",
      title: "Get your hours back",
      description:
        "Every recurring task you currently do by hand — schedules, counts, reports, reminders — runs in the background instead. The hours you used to lose to admin come back to you, every single week.",
      stat: "11 hrs",
      statLabel: "avg. admin hours returned / week",
    },
    {
      id: "money",
      label: "Money",
      title: "Spend less, keep more",
      description:
        "ServeSync flags overtime before it happens, catches supplier invoice errors automatically, and keeps ordering aligned to what you actually sell — so less of your revenue leaks out through small, repeated mistakes.",
      stat: "$1,800+",
      statLabel: "avg. monthly savings, labor + waste + billing",
    },
    {
      id: "waste",
      label: "Waste",
      title: "See spoilage before it happens",
      description:
        "Every breakage and spoilage gets logged in seconds, not shrugged off. ServeSync tracks the pattern and warns you before the next batch turns — so waste becomes a number you manage, not a surprise you absorb.",
      stat: "-30%",
      statLabel: "avg. reduction in reported waste cost",
    },
    {
      id: "admin",
      label: "Admin",
      title: "Automate the paperwork",
      description:
        "Invoices, compliance logs, temperature checks, supplier reconciliation — the recurring low-value tasks that eat a manager's day run themselves in the background. Fewer typos, no missed steps, and your energy goes to the parts of the business only you can run.",
      stat: "70%",
      statLabel: "of recurring admin fully automated",
    },
    {
      id: "shifts",
      label: "Shifts",
      title: "The schedule builds itself",
      description:
        "Staff submit availability through a simple form. ServeSync — powered by Power Automate under the hood — turns that into a finished weekly schedule, handles swap requests, and notifies the team. You never type a shift by hand again.",
      stat: "0 min",
      statLabel: "manual typing to publish a weekly schedule",
    },
  ] as Pillar[],

  extraAutomations: [
    {
      title: "Compliance & safety logs",
      description:
        "Temperature checks, HACCP records, and opening/closing sign-offs are timestamped and stored automatically — ready the moment an inspector asks.",
    },
    {
      title: "Guest inquiries, answered",
      description:
        "Common questions — hours, bookings, allergens — get handled instantly, so front-of-house isn't interrupted every five minutes.",
    },
    {
      title: "Multi-site reporting",
      description:
        "Labor, waste, and sales roll up across every location into one dashboard, so groups and shopping-center operators see the whole portfolio at a glance.",
    },
  ] as ExtraAutomation[],

  pricing: [
    {
      name: "Counter",
      audience: "Family restaurants & single-site cafés",
      price: "$39",
      cadence: "/month",
      lineItems: [
        "Auto-built weekly schedule",
        "Inventory & waste tracking",
        "Daily checklists, automated",
        "1 location",
      ],
    },
    {
      name: "Kitchen",
      audience: "Full-service restaurants & QSR",
      price: "$99",
      cadence: "/month",
      lineItems: [
        "Everything in Counter",
        "Predictive waste & reorder alerts",
        "Invoice & supplier reconciliation",
        "Overtime & labor-cost alerts",
        "Up to 3 locations",
      ],
      highlight: true,
    },
    {
      name: "Group",
      audience: "Multi-location groups & shopping centers",
      price: "Custom",
      cadence: "pricing",
      lineItems: [
        "Everything in Kitchen",
        "Unlimited locations",
        "Portfolio-wide reporting",
        "Dedicated onboarding & support",
      ],
    },
  ] as PricingTier[],

  faqs: [
    {
      question: "What exactly is ServeSync?",
      answer:
        "A back-office platform that automates scheduling, inventory, waste tracking, and daily admin for hospitality businesses — so managers spend less time on paperwork and more time running the floor.",
    },
    {
      question: "How does the shift scheduling actually work?",
      answer:
        "Your team submits availability through a simple form. Behind the scenes, ServeSync (built on Power Automate) turns that into a complete weekly schedule, handles swap requests, and notifies staff automatically — no manual typing required.",
    },
    {
      question: "Who is ServeSync built for?",
      answer:
        "Family-run restaurants, full-service and quick-service restaurants, cafés, multi-location hospitality groups, and shopping-center operators managing shared services across tenants.",
    },
    {
      question: "Do I need technical skills to set it up?",
      answer:
        "No. Most operators are fully onboarded in under 15 minutes — upload your staff list and suppliers, and ServeSync takes it from there.",
    },
    {
      question: "Can it handle more than one location?",
      answer:
        "Yes. The Kitchen plan covers up to 3 locations, and Group is built specifically for multi-site operators who need portfolio-wide reporting.",
    },
    {
      question: "What does it cost to try it?",
      answer:
        "Every plan starts with a free 14-day trial — no card required. You'll see your first automated schedule and waste report within the first week.",
    },
  ] as FAQ[],
};

export default serveSync;