import { mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";

// Demo seed for Agency Studio OS.
// - `seed:run`        — CLI/power use: wipes content then inserts (npx convex run seed:run).
// - `seed:seedSample` — in-app one-click for non-coders: requires login, inserts
//                       ONLY when the site is still empty (never wipes real work).
//
// Data mirrors components/templates/agency-studio/shared/*-seed.ts (the former
// localStorage SEED_STATE), converted to Convex inserts.
const now = 1_780_000_000_000;
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;
const hr = (n: number) => now - n * 60 * 60 * 1000;
const min = (n: number) => now - n * 60 * 1000;

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";

const LONG_BODY = `Setiap brand system yang kami kerjakan dimulai dari satu pertanyaan: apa yang akan diukur tim ini enam bulan setelah peluncuran? Kalau jawabannya kabur, identitas visual tidak akan menyelamatkan. Strategi dulu, baru bentuk.

Dalam project ini kami menjalankan delapan stakeholder interview, tiga competitor audit, dan satu sprint naming dua hari. Hasilnya bukan deck cantik — tapi satu kalimat positioning yang dipakai sales, satu set token warna yang dipakai engineering, dan satu motion principle yang dipakai marketing.`;

const PROJECTS = [
  { slug: "northwind-rebrand", title: "Northwind — full identity rebrand", client: "Northwind Logistics", category: "Brand Identity", cover: "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=1400&q=70", blurb: "Repositioning a 30-year logistics firm for the modern shipper.", brief: LOREM, outcome: "Visual system rolled out across 14 markets, +28% inbound demo requests Q1 post-launch.", status: "delivered" as const, publishedAt: day(40), featured: true },
  { slug: "cumulus-design-system", title: "Cumulus — design system v2", client: "Cumulus SaaS", category: "Design System", cover: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=70", blurb: "Tokens, components, and motion primitives for a cross-platform SaaS.", brief: LOREM, outcome: "Time-to-prototype reduced 40%; designer-engineer handoff issues down 60%.", status: "delivered" as const, publishedAt: day(70), featured: true },
  { slug: "zenith-launch", title: "Zenith — product launch site", client: "Zenith Health", category: "Web Launch", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=70", blurb: "Pre-order launch site for a connected-device health startup.", brief: LOREM, outcome: "1.2k pre-orders in 14 days, $480k pre-launch revenue.", status: "delivered" as const, publishedAt: day(90), featured: false },
  { slug: "atlas-internal", title: "Atlas — internal portal redesign", client: "Atlas Group", category: "Product Design", cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=70", blurb: "Frontline workforce portal — shift swaps, payroll, training.", brief: LOREM, outcome: "Active users 2.4× over 60 days; support tickets cut by 35%.", status: "build" as const, publishedAt: day(15), featured: false },
  { slug: "kira-discovery", title: "Kira — strategy discovery", client: "Kira AI", category: "Strategy", cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=70", blurb: "Positioning workshop + market study for a Series A AI startup.", brief: LOREM, outcome: "In progress — kickoff complete, market interviews underway.", status: "discovery" as const, publishedAt: day(5), featured: false },
];

const CLIENTS = [
  { name: "Northwind Logistics", industry: "Logistics", contact: "Hana Wibowo", email: "hana@northwind.example", status: "active" as const, startedAt: day(120), notes: "Phase 2 retainer signed." },
  { name: "Cumulus SaaS", industry: "B2B SaaS", contact: "Diego R.", email: "diego@cumulus.example", status: "active" as const, startedAt: day(180), notes: "Quarterly design system sync." },
  { name: "Zenith Health", industry: "Healthtech", contact: "Maya P.", email: "maya@zenith.example", status: "alumni" as const, startedAt: day(280), notes: "Launch delivered, references available." },
  { name: "Atlas Group", industry: "Retail", contact: "Pak Anto", email: "anto@atlas.example", status: "active" as const, startedAt: day(45), notes: "Build sprint 3 of 6." },
  { name: "Kira AI", industry: "AI", contact: "Sari L.", email: "sari@kira.example", status: "prospect" as const, startedAt: day(8), notes: "Discovery scope priced; awaiting PO." },
];

const SERVICES = [
  { slug: "brand-strategy", name: "Brand Strategy Sprint", blurb: "Two-week intensive — positioning, narrative, audience map, naming.", priceLabel: "Rp 65jt", duration: "2 minggu", bullets: ["Stakeholder interviews", "Competitor + market scan", "Positioning canvas", "Narrative deck", "Naming exploration"], featured: true },
  { slug: "visual-identity", name: "Visual Identity System", blurb: "Logo, type, color, motion, and component-level rules.", priceLabel: "Rp 120jt", duration: "5–8 minggu", bullets: ["Logo + lockups", "Typography palette", "Color tokens (OKLch)", "Motion primitives", "Brand guidelines doc"], featured: true },
  { slug: "design-system", name: "Design System Build", blurb: "Production-ready tokens + components in your stack (React/Tailwind/RN).", priceLabel: "Rp 250jt", duration: "8–12 minggu", bullets: ["Token architecture", "Storybook setup", "20+ core components", "Docs + adoption playbook"], featured: false },
  { slug: "design-ops", name: "Design Ops Retainer", blurb: "Embedded design partnership — sprints, reviews, hiring help.", priceLabel: "Rp 35jt /bulan", duration: "rolling", bullets: ["Weekly sprints", "Design reviews", "Recruitment + interview help", "Tooling audits"], featured: false },
];

// Public /process stepper. `order` drives sort + admin reorder; mirrors the
// frontend SEED_PROCESS_STEPS array (journal-seed.ts) the page used to hardcode.
const PROCESS_STEPS = [
  { index: 1, phase: "Discovery", blurb: "Stakeholder interviews, market scan, dan workshop positioning. Kami pulang dengan satu kalimat positioning yang tim sales bisa pakai besok.", duration: "1–2 minggu", deliverables: ["Stakeholder map", "Competitor audit", "Positioning canvas", "Audience hypothesis"], order: 10 },
  { index: 2, phase: "Design Sprint", blurb: "Dua minggu intensif. Bukan 40 logo direction — tiga territory yang berbeda secara strategis, masing-masing teruji ke audience proxy.", duration: "2–3 minggu", deliverables: ["Brand territories", "Type + color tokens", "Motion principles", "Naming exploration"], order: 20 },
  { index: 3, phase: "Build", blurb: "Production-ready: tokens di Figma + Tailwind, komponen di Storybook, motion primitives di Framer. Engineering di-loop sejak hari satu.", duration: "5–10 minggu", deliverables: ["Token architecture", "Component library", "Storybook docs", "Adoption playbook"], order: 30 },
  { index: 4, phase: "Launch & Revisit", blurb: "Soft launch internal dulu, kemudian eksternal. Kami kembali setelah 6 minggu untuk audit adopsi — gratis, bagian dari paket.", duration: "2 minggu + 6 minggu revisit", deliverables: ["Launch checklist", "Internal training session", "Adoption metrics dashboard", "Six-week revisit audit"], order: 40 },
];

// id retained as `_seedId` so comments can key the right article post-insert.
const ARTICLES = [
  { _seedId: "art-1", slug: "northwind-rebrand-six-month-revisit", title: "Northwind: enam bulan setelah rebrand", excerpt: "Apa yang berubah setelah identitas baru diluncurkan ke 14 pasar — angka, friksi, dan satu surprise.", body: LONG_BODY, category: "case-study" as const, author: "Asti R.", readMinutes: 7, publishedAt: day(12), cover: "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=1400&q=70", image: "https://picsum.photos/seed/agency-art-northwind/800/600", featured: true },
  { _seedId: "art-2", slug: "design-system-adoption-playbook", title: "Playbook adopsi design system — versi 2026", excerpt: "Dari Storybook ke production: bagaimana memastikan komponen dipakai, bukan dipajang.", body: LONG_BODY, category: "essay" as const, author: "Bagas P.", readMinutes: 9, publishedAt: day(28), cover: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=70", image: "https://picsum.photos/seed/agency-art-designsystem/800/600", featured: true },
  { _seedId: "art-3", slug: "naming-sprint-two-day-format", title: "Naming sprint dalam dua hari, bukan dua bulan", excerpt: "Format workshop terkompresi yang kami pakai untuk semua project sejak Q3.", body: LONG_BODY, category: "field-notes" as const, author: "Citra W.", readMinutes: 5, publishedAt: day(45), image: "https://picsum.photos/seed/agency-art-namingsprint/800/600" },
  { _seedId: "art-4", slug: "motion-tokens-oklch-experiment", title: "Motion tokens + OKLch: eksperimen cross-platform", excerpt: "Mendokumentasikan motion seperti color tokens — apa yang berhasil, apa yang patah.", body: LONG_BODY, category: "essay" as const, author: "Daniel S.", readMinutes: 11, publishedAt: day(60), cover: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=70" },
  { _seedId: "art-5", slug: "zenith-launch-1200-preorders", title: "Zenith — 1.200 pre-order dalam 14 hari", excerpt: "Anatomi launch site yang ramping: tiga halaman, satu form, nol distraksi.", body: LONG_BODY, category: "case-study" as const, author: "Asti R.", readMinutes: 8, publishedAt: day(85), cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=70" },
];
const HERO_EMOJI = ["🧭", "📐", "⚡️", "🎛️", "🚀"];
const tagsFor = (cat: string) =>
  cat === "case-study" ? ["case-study", "B2B", "outcomes"]
    : cat === "essay" ? ["essay", "process", "studio-ops"]
      : ["field-notes", "workshop"];

const COMMENTS = [
  { postSeedId: "art-1", postTitle: ARTICLES[0].title, author: "Visitor", email: "buyfollowers@spam.example", body: "Buy cheap followers now, http://spam.example — best service in 2026!", status: "pending" as const, aiFlag: "spam" as const, ts: min(35) },
  { postSeedId: "art-1", postTitle: ARTICLES[0].title, author: "Reni Saputri", email: "reni@cumulus.example", body: "Insight tentang stakeholder interview yang singkat tapi tajam itu yang paling kami butuhkan.", status: "pending" as const, aiFlag: null, ts: hr(2) },
  { postSeedId: "art-2", postTitle: ARTICLES[1].title, author: "Daniel S.", email: "daniel@studio.example", body: "Adoption playbook yang kami tunggu. Bagian motion principle = secret sauce.", status: "approved" as const, aiFlag: null, ts: hr(8) },
  { postSeedId: "art-3", postTitle: ARTICLES[2].title, author: "Maya P.", email: "maya@zenith.example", body: "Naming sprint dua-hari — kami coba dan berhasil pangkas dari delapan minggu ke tiga. Recommended.", status: "approved" as const, aiFlag: null, ts: day(1) },
  { postSeedId: "art-2", postTitle: ARTICLES[1].title, author: "anon", email: "anon@example.com", body: "Stupid take, you have no idea what enterprise design ops is.", status: "pending" as const, aiFlag: "toxic" as const, ts: day(2) },
  { postSeedId: "art-4", postTitle: ARTICLES[3].title, author: "Bagas P.", email: "bagas@studio.example", body: "OKLch + motion tokens — kombinasi yang masih jarang. Saya akan adopsi untuk project Atlas berikutnya.", status: "approved" as const, aiFlag: null, ts: day(3) },
  { postSeedId: "art-5", postTitle: ARTICLES[4].title, author: "Sari L.", email: "sari@kira.example", body: "Launch site yang ramping memang underrated. Tiga halaman, satu form — kami akan tiru pendekatan ini.", status: "approved" as const, aiFlag: null, ts: day(5) },
];

// Mirrors components/templates/agency-studio/shared/team-seed.ts SEED_TEAM.
// `links` serialized to JSON to match the agencyTeam.links string column.
const TEAM = [
  { name: "Asti Rahmadhani", role: "Studio principal · strategy", bio: "Membangun atelier.studio sejak 2019. Sebelumnya design lead di dua agency Jakarta. Spesialisasi: positioning B2B, naming, dan governance brand system.", avatar: "🪐", initials: "AR", location: "Jakarta", links: JSON.stringify([{ label: "LinkedIn", href: "#" }, { label: "Read writing", href: "/journal?author=Asti" }]), order: 10 },
  { name: "Bagas Pranoto", role: "Design lead · identity systems", bio: "Type-nerd, motion-curious. Lead untuk semua identity work — dari logo lockup hingga motion principles. Eks-team brand Tokopedia.", avatar: "🎨", initials: "BP", location: "Yogyakarta", links: JSON.stringify([{ label: "Dribbble", href: "#" }, { label: "Are.na", href: "#" }]), order: 20 },
  { name: "Citra Wijaya", role: "Strategy lead · research", bio: "Strategy lead untuk semua discovery sprint. Latar belakang qualitative research + service design. Memimpin proses interview dan synthesis.", avatar: "🧭", initials: "CW", location: "Bandung", links: JSON.stringify([{ label: "Substack", href: "#" }]), order: 30 },
  { name: "Daniel Suharto", role: "Engineering lead · design ops", bio: "Menjembatani Figma ke production. Token architecture, Storybook setup, dan handoff tooling. React + Tailwind di siang hari, motion di malam hari.", avatar: "⚙️", initials: "DS", location: "Singapore (remote)", links: JSON.stringify([{ label: "GitHub", href: "#" }]), order: 40 },
  { name: "Maya Putri", role: "Account director · partnerships", bio: "Titik kontak pertama untuk semua project baru. Menjaga scope, timeline, dan komunikasi dua arah dengan tim klien.", avatar: "🤝", initials: "MP", location: "Jakarta", links: JSON.stringify([{ label: "Email", href: "mailto:halo@atelier.studio" }]), order: 50 },
];

const LEADS = [
  { name: "Rina Halim", company: "Halim Furniture", email: "rina@halim.example", topic: "Visual identity refresh", source: "Contact form", budget: "Rp 80–120jt", status: "new" as const, ts: hr(2) },
  { name: "Bayu A.", company: "PT Sumber Tani", email: "bayu@stani.example", topic: "Brand strategy + naming", source: "Service: Brand Strategy", budget: "Rp 65jt", status: "contacted" as const, ts: day(2) },
  { name: "Cinta M.", company: "Cinta & Co", email: "cinta@cintaco.example", topic: "Web launch site", source: "Referral", budget: "Rp 40–60jt", status: "qualified" as const, ts: day(5) },
  { name: "Tom P.", company: "Tomo Tools", email: "tom@tomotools.example", topic: "Design system audit", source: "Service: Design System", budget: ">Rp 200jt", status: "won" as const, ts: day(12) },
];

const SUBSCRIBERS = [
  { email: "founder@northwind.example", status: "confirmed" as const, source: "footer", ts: day(120) },
  { email: "diego@cumulus.example", status: "confirmed" as const, source: "lead-magnet", ts: day(80) },
  { email: "maya@zenith.example", status: "confirmed" as const, source: "journal:naming-sprint-two-day-format", ts: day(45) },
  { email: "anto@atlas.example", status: "confirmed" as const, source: "footer", ts: day(30) },
  { email: "sari@kira.example", status: "pending" as const, source: "lead-magnet", ts: day(7) },
  { email: "studio@halim.example", status: "confirmed" as const, source: "footer", ts: day(20) },
  { email: "ceo@sumber-tani.example", status: "confirmed" as const, source: "journal:design-system-adoption-playbook", ts: day(18) },
  { email: "ops@cintaco.example", status: "pending" as const, source: "footer", ts: day(3) },
  { email: "founder@tomotools.example", status: "unsubscribed" as const, source: "lead-magnet", ts: day(150) },
  { email: "design@nucleo.example", status: "confirmed" as const, source: "footer", ts: day(12) },
  { email: "growth@vela.example", status: "confirmed" as const, source: "journal:zenith-launch-1200-preorders", ts: day(9) },
  { email: "rahmat@kandang-studio.example", status: "pending" as const, source: "footer", ts: day(1) },
];

const PREVIEW_BODY = `Halo,\n\nBulan ini kami mengirimkan tiga catatan singkat dari studio. Kalau ada yang relevan untuk roadmap tim Anda, balas email ini.\n\n— Asti R., Studio principal`;

const NEWSLETTERS = [
  { subject: "Studio dispatch — Mei 2026", preheader: "Naming sprint, OKLch motion, dan revisit klien enam-bulan.", body: PREVIEW_BODY, status: "sent" as const, sentAt: day(7), recipients: 9, ts: day(8) },
  { subject: "Quarterly digest — Q2 2026", preheader: "Tiga case study + dua field-notes dari tim.", body: "Draft awal — perlu poles intro + sisipkan dua link case study terakhir.", status: "draft" as const, sentAt: 0, recipients: 0, ts: day(2) },
  { subject: "Welcome ke Agency Studio Journal", preheader: "Apa yang akan Anda terima — dan kapan.", body: "Onboarding email untuk subscriber baru. Status: scheduled, kirim setiap H+1 setelah konfirmasi.", status: "scheduled" as const, sentAt: 0, recipients: 0, ts: day(1) },
];

// Keep in sync with components/templates/agency-studio/shared/landing-seed.ts
// SEED_LANDING_SECTIONS. `syncLanding` below pushes additions/order to an
// already-seeded deployment without touching admin-edited copy.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: "Brand, design system, and product partner for ambitious teams.", subtitle: "Two-week sprints, multi-month builds, and embedded retainers — pick what fits.", enabled: true, layers: [{ id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" }] },
  { id: "ls-stats", order: 15, kind: "stats", title: "By the numbers", subtitle: "A few quick signals from recent quarters.", enabled: true },
  { id: "ls-features", order: 18, kind: "features", title: "Why teams pick us", subtitle: "The operating principles behind every engagement.", enabled: true },
  { id: "ls-portfolio", order: 20, kind: "portfolio", title: "Recent client engagements", subtitle: "A peek at what we've shipped lately.", enabled: true },
  { id: "ls-services", order: 30, kind: "services", title: "Productized + retainer engagements", subtitle: "Pick a sprint, a system build, or an embedded retainer.", enabled: true },
  { id: "ls-process", order: 35, kind: "custom", title: "How we work", subtitle: "Empat fase, satu sistem — dari discovery hingga six-week revisit.", enabled: true, config: '{"ctaLabel":"See the process","ctaHref":"/process"}' },
  { id: "ls-testimonials", order: 38, kind: "testimonials", title: "Teams we've shipped with", subtitle: "Real words from product, marketing, and founding teams.", enabled: true },
  { id: "ls-pricing", order: 42, kind: "pricing", title: "Engagement models", subtitle: "Project, retainer, or embedded — pick the shape that fits.", enabled: true },
  { id: "ls-faq", order: 46, kind: "faq", title: "Frequently asked", subtitle: "Start dates, pricing, and how the work actually runs.", enabled: true },
  { id: "ls-blog", order: 48, kind: "blog", title: "From the journal", subtitle: "Case-study revisits, playbooks, and field notes from the studio.", enabled: true },
  { id: "ls-cta", order: 50, kind: "cta", title: "Brief us — get a proposal in 5 days.", subtitle: "No commitment. We respond within 24h.", enabled: true },
  { id: "ls-newsletter", order: 55, kind: "newsletter", title: "Studio notes, monthly", subtitle: "One email a month — what we shipped, what we learned. No spam.", enabled: true },
];

const PAGES = [
  { id: "sys-home", slug: "", title: "Home", description: "Studio landing — hero, featured work, services, CTA.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true, isLanding: true },
  { id: "sys-services", slug: "services", title: "Services", description: "Brand strategy, identity, design system, ops retainer.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-portfolio", slug: "portfolio", title: "Work", description: "Project case studies grid.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-about", slug: "about", title: "About", description: "Studio principles, team, awards.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-contact", slug: "contact", title: "Contact", description: "Project inquiry form, calendar, address.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
];

// All demo content inserts (no wipe). Shared by `run` and `seedSample`.
async function insertAll(ctx: any, opts: { landing?: boolean } = {}) {
  for (const p of PROJECTS) await ctx.db.insert("agencyProjects", p);
  for (const c of CLIENTS) await ctx.db.insert("agencyClients", c);
  for (const s of SERVICES) await ctx.db.insert("agencyServices", s);
  for (const p of PROCESS_STEPS) await ctx.db.insert("agencyProcessSteps", p);
  for (const l of LEADS) await ctx.db.insert("agencyLeads", l);

  // Articles: remember the slug keyed by the seed id so comments link up to
  // the public journal route (comment_threads anchors on targetId = slug).
  const articleSlugBySeed = new Map<string, string>();
  for (let i = 0; i < ARTICLES.length; i++) {
    const { _seedId, ...rest } = ARTICLES[i];
    await ctx.db.insert("agencyArticles", {
      ...rest,
      status: i < 4 ? "published" : "draft",
      heroEmoji: HERO_EMOJI[i % 5],
      tags: tagsFor(rest.category),
    });
    articleSlugBySeed.set(_seedId, rest.slug);
  }

  // Comments live in `comment_threads` — the SAME table the public
  // comments-section writes to and the admin CommentsView now moderates.
  // targetKind/targetId match the public journal detail page's target.
  for (const c of COMMENTS) {
    const { postSeedId, postTitle, author, email, body, status, aiFlag, ts } = c;
    await ctx.db.insert("comment_threads", {
      tenantId: null,
      actorId: "seed",
      targetKind: "journal",
      targetId: articleSlugBySeed.get(postSeedId) ?? postSeedId,
      body,
      status,
      aiFlag,
      authorName: author,
      authorEmail: email,
      postTitle,
      createdAt: ts,
      updatedAt: ts,
    });
  }

  for (const t of TEAM) await ctx.db.insert("agencyTeam", t);
  for (const s of SUBSCRIBERS) await ctx.db.insert("agencySubscribers", s);
  for (const n of NEWSLETTERS) await ctx.db.insert("agencyNewsletters", n);
  if (opts.landing !== false) for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
  for (const p of PAGES) await ctx.db.insert("pages", { entryId: p.id, slug: p.slug, data: p });

  return {
    projects: PROJECTS.length,
    clients: CLIENTS.length,
    services: SERVICES.length,
    processSteps: PROCESS_STEPS.length,
    leads: LEADS.length,
    articles: ARTICLES.length,
    team: TEAM.length,
    comments: COMMENTS.length,
    subscribers: SUBSCRIBERS.length,
    newsletters: NEWSLETTERS.length,
    landing: LANDING.length,
    pages: PAGES.length,
  };
}

const CONTENT_TABLES = [
  "agencyProjects",
  "agencyClients",
  "agencyServices",
  "agencyProcessSteps",
  "agencyLeads",
  "agencyArticles",
  "agencyTeam",
  "agencyComments",
  "comment_threads",
  "agencySubscribers",
  "agencyNewsletters",
  "agencyAiConfig",
  "landingSections",
  "pages",
] as const;

// Power/CLI seed: wipes content tables first, then inserts. Destructive — only
// for terminal use where you explicitly want a reset.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    for (const t of CONTENT_TABLES) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    return insertAll(ctx);
  },
});

// Demo/CLI seed (NO auth, internal — run via `npx convex run seed:seedDemo`).
// For SHOWCASE/demo deployments only. Refills the content tables for a full
// demo and seeds the landing lineup if empty, WITHOUT wiping admin-edited
// landing copy. Idempotent.
export const seedDemo = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const t of CONTENT_TABLES) {
      if (t === "landingSections") continue;
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    const counts = await insertAll(ctx, { landing: false });
    // Seed landing only if the table is empty (preserve admin-edited copy).
    const hasLanding = await ctx.db.query("landingSections").first();
    if (!hasLanding) {
      for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
    }
    return counts;
  },
});

// Additive landing sync for already-seeded deployments: inserts LANDING
// entries whose sectionId is missing and aligns `order` to the canonical
// lineup. Never touches admin-edited copy/enabled/config on existing rows.
export const syncLanding = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let inserted = 0;
    let reordered = 0;
    for (const s of LANDING) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", s.id))
        .unique();
      if (!existing) {
        await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
        inserted++;
      } else if ((existing.data as { order?: number }).order !== s.order) {
        await ctx.db.patch(existing._id, {
          data: { ...(existing.data as Record<string, unknown>), order: s.order },
        });
        reordered++;
      }
    }
    return { inserted, reordered };
  },
});

// T07: additive image backfill for already-seeded deployments. Matches each
// article by slug and fills `image` ONLY when the row has none yet — never
// overwrites an admin-set photo. Mirrors wirausaha's syncCatalogImages.
export const syncArticleImages = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let patched = 0;
    for (const a of ARTICLES) {
      const image = (a as { image?: string }).image;
      if (!image) continue;
      const existing = await ctx.db
        .query("agencyArticles")
        .withIndex("by_slug", (q) => q.eq("slug", a.slug))
        .first();
      if (existing && !existing.image) {
        await ctx.db.patch(existing._id, { image });
        patched++;
      }
    }
    return { patched };
  },
});

// In-app one-click seed for non-technical owners. Safe: requires an authenticated
// admin AND only runs on an empty site, so it can never wipe real content.
export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const hasProjects = await ctx.db.query("agencyProjects").first();
    const hasLanding = await ctx.db.query("landingSections").first();
    if (hasProjects || hasLanding) {
      return { seeded: false, reason: "already-has-content" as const };
    }
    const counts = await insertAll(ctx);
    return { seeded: true, ...counts };
  },
});
