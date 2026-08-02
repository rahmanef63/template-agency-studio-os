// SINGLE SOURCE of agency-studio's landing example content.
//
// Imported by BOTH:
//  - convex/seed.ts → seeds each item section's `config` into landingSections,
//    so a fresh clone gets EDITABLE example data in the admin landing editor
//    (not just code-only defaults).
//  - frontend/slices/home/* → the render fallback (used before the seed runs).
//
// MUST stay framework-pure: no convex/server, no convex/values, no React/lucide
// imports — only literals + plain types — so the Convex bundler AND the Next
// client can both import it. Feature icons are lucide NAMES (string), resolved
// to components in feature-config.ts. Hrefs are root-relative (publicBase = "").
//
// Edit content HERE once; the seed and the render both follow. No drift.

export type LcFeature = { icon: string; title: string; blurb: string };
export type LcTestimonial = { quote: string; author: string; role?: string; rating?: number };
export type LcFaq = { q: string; a: string };
export type LcTier = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
};

export const HERO = {
  title: "Brand, design system, and product partner for ambitious teams.",
  subtitle:
    "Two-week sprints, multi-month builds, and embedded retainers — pick what fits.",
};

export const FEATURES: LcFeature[] = [
  { icon: "Compass", title: "Strategy first", blurb: "Positioning before pixels — every engagement starts with the why." },
  { icon: "Layers", title: "Systems, not assets", blurb: "Tokens, components, and guidelines your team actually adopts." },
  { icon: "UserCheck", title: "Principal-led", blurb: "A principal runs every project end-to-end. No handoff to juniors." },
  { icon: "Globe", title: "Async-first", blurb: "Two fixed syncs a week, any timezone — progress you can read." },
];

export const TESTIMONIALS: LcTestimonial[] = [
  { quote: "They shipped a brand system our own team actually uses — components, tokens, and the why behind every call.", author: "Hana Wibowo", role: "VP Marketing — Northwind Logistics" },
  { quote: "Two-week sprint, zero fluff. The positioning deck still runs our sales narrative a year later.", author: "Diego R.", role: "Head of Product — Cumulus SaaS" },
  { quote: "Launch landed on time and the six-week revisit caught what we missed. Rare discipline.", author: "Maya P.", role: "CEO — Zenith Health" },
  { quote: "Felt embedded, not outsourced. Our designers leveled up just by pairing with them.", author: "Pak Anto", role: "Brand Director — Atlas Group" },
];

export const FAQS: LcFaq[] = [
  { q: "How fast can we start?", a: "Discovery slots open every 2–3 weeks. Send a brief and we respond within 24h with a scope and a start date." },
  { q: "What does an engagement cost?", a: "Productized sprints are fixed-price — see Services. Retainers and multi-month builds are scoped after discovery." },
  { q: "Who actually does the work?", a: "A principal leads every project end-to-end. No handoff to juniors or account managers." },
  { q: "Do you work with remote teams?", a: "Yes — most engagements run async-first with two fixed syncs per week, any timezone." },
];

export const PRICING: LcTier[] = [
  {
    name: "Project",
    price: "From Rp 65jt",
    blurb: "Fixed-scope sprint — strategy, identity, or a launch site.",
    features: ["Scoped brief + fixed timeline", "Principal-led, no handoffs", "Two structured revision rounds", "Six-week post-launch revisit"],
    ctaLabel: "Send the brief",
    ctaHref: "/contact",
  },
  {
    name: "Retainer",
    price: "Rp 35jt",
    period: "/month",
    blurb: "Design ops partnership on a rolling monthly cadence.",
    features: ["Weekly design sprints", "Design + brand reviews", "Priority booking for new scopes", "Pause or scale any month"],
    featured: true,
    ctaLabel: "Book a call",
    ctaHref: "/contact",
  },
  {
    name: "Embedded team",
    price: "Custom",
    blurb: "A 2–3 person pod inside your product org for multi-month builds.",
    features: ["Design system + product design", "Async-first, in your tools", "Hiring + interview support", "Quarterly roadmap input"],
    ctaLabel: "Talk to us",
    ctaHref: "/contact",
  },
];

// Process-tease `custom` section. PROCESS_BODY = body paragraphs; PROCESS_CTA =
// the section CTA threaded through config (label + root-relative href).
export const PROCESS_BODY: string[] = [
  "Empat fase, satu sistem: discovery, design, build, dan six-week revisit. Setiap fase punya scope yang jelas, deliverable yang spesifik, dan tim klien yang terlibat sejak hari satu.",
  "Bukan handoff, tapi adopsi — klien yang dilibatkan sejak awal mengadopsi sistem 3× lebih cepat.",
];

export const PROCESS_CTA = { ctaLabel: "See the process", ctaHref: "/process" };
