import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin-panel "Analytics" block — READ-ONLY. Mirrors convex/settings.ts auth
// guard (getAuthUserId -> throw if not signed in). No mutations: analytics is
// read-only by nature. KPIs + the 30-day series are computed from REAL agency
// tables (agencyProjects, agencyLeads, agencySubscribers, comment_threads,
// agencyArticles) via _creationTime. sources / topPages / funnel are
// illustrative — there is no event-tracking infra in this template (the
// event-tracking slice is config-only), so those keep the demo's seed shape.
// See the // ponytail: comments below.

const DAY_MS = 86_400_000;
const WINDOW_DAYS = 30;

// Donut palette + funnel/page labels — kept here so the query returns the same
// shape the bindings expect. Counts that we CAN derive cheaply use real data.
const SOURCE_PALETTE = [
  { id: "direct", label: "Direct", color: "#a78bfa" },
  { id: "search", label: "Organic search", color: "#34d399" },
  { id: "referral", label: "Referral", color: "#fbbf24" },
  { id: "social", label: "Social", color: "#60a5fa" },
  { id: "email", label: "Email", color: "#f87171" },
] as const;

function pct(curr: number, prev: number): number {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * DAY_MS;
    const prevStart = now - 2 * WINDOW_DAYS * DAY_MS;

    // Pull every row's _creationTime from the real content tables. These tables
    // are small (admin-managed content), so a full collect is fine.
    const [projects, leads, subscribers, comments, articles] = await Promise.all([
      ctx.db.query("agencyProjects").collect(),
      ctx.db.query("agencyLeads").collect(),
      ctx.db.query("agencySubscribers").collect(),
      // Live comments land in comment_threads (the agencyComments table is dead —
      // nothing writes to it). Soft-deleted rows still count as past activity.
      ctx.db.query("comment_threads").collect(),
      ctx.db.query("agencyArticles").collect(),
    ]);

    // --- KPI cards (REAL counts, deltas vs the previous 30-day window) ---
    const inWindow = <T extends { _creationTime: number }>(rows: T[], from: number, to: number) =>
      rows.filter((r) => r._creationTime >= from && r._creationTime < to).length;

    const leadsCurr = inWindow(leads, windowStart, now);
    const leadsPrev = inWindow(leads, prevStart, windowStart);
    const subsCurr = inWindow(subscribers, windowStart, now);
    const subsPrev = inWindow(subscribers, prevStart, windowStart);
    const projCurr = inWindow(projects, windowStart, now);
    const projPrev = inWindow(projects, prevStart, windowStart);

    const kpis = [
      {
        id: "projects",
        label: "Projects",
        value: projects.length.toLocaleString(),
        deltaPct: Number(pct(projCurr, projPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "leads",
        label: "Leads",
        value: leads.length.toLocaleString(),
        deltaPct: Number(pct(leadsCurr, leadsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "subscribers",
        label: "Subscribers",
        value: subscribers.length.toLocaleString(),
        deltaPct: Number(pct(subsCurr, subsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "articles",
        label: "Articles",
        value: articles.length.toLocaleString(),
        deltaPct: 0, // ponytail: articles is a small admin-managed set, deltas not meaningful
        hint: "total published",
      },
    ];

    // --- 30-day series (REAL): per-day new content + new sessions proxy ---
    // views = projects+leads+subscribers+comments+articles created that day (a
    // real activity signal), sessions = leads+subscribers+projects that day.
    const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);
    const viewsByDay = new Map<string, number>();
    const sessByDay = new Map<string, number>();
    const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
    for (const r of [...projects, ...leads, ...subscribers, ...comments, ...articles]) {
      if (r._creationTime < windowStart) continue;
      bump(viewsByDay, dayKey(r._creationTime));
    }
    for (const r of [...leads, ...subscribers, ...projects]) {
      if (r._creationTime < windowStart) continue;
      bump(sessByDay, dayKey(r._creationTime));
    }
    const series = Array.from({ length: WINDOW_DAYS }, (_, i) => {
      const d = dayKey(windowStart + (i + 1) * DAY_MS);
      return { date: d, views: viewsByDay.get(d) ?? 0, sessions: sessByDay.get(d) ?? 0 };
    });

    // --- Traffic sources (REAL labels mapped from lead/subscriber `source`) ---
    // We DO have a `source` string on leads + subscribers, so the donut is real:
    // bucket each into the known palette ids (fallback -> "direct").
    const knownIds = new Set<string>(SOURCE_PALETTE.map((s) => s.id));
    const visitsById = new Map<string, number>();
    for (const r of [...leads, ...subscribers]) {
      const key = knownIds.has(r.source) ? r.source : "direct";
      visitsById.set(key, (visitsById.get(key) ?? 0) + 1);
    }
    const sources = SOURCE_PALETTE.map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      visits: visitsById.get(s.id) ?? 0,
    }));

    // --- Top pages: REAL paths from published articles. ---
    // ponytail: illustrative — no event-tracking infra, so views/duration/bounce
    // are derived deterministically (readMinutes) so the table isn't empty.
    const topPages = [...articles]
      .sort((a, b) => (b.readMinutes ?? 0) - (a.readMinutes ?? 0))
      .slice(0, 6)
      .map((a) => ({
        path: `/journal/${a.slug}`,
        title: a.title,
        views: Math.max(1, (a.readMinutes ?? 1) * 40),
        avgDurationSec: Math.max(30, (a.readMinutes ?? 1) * 60),
        bounceRate: 0.35,
      }));

    // --- Conversion funnel ---
    // ponytail: illustrative — no event-tracking infra to measure scroll/CTA
    // steps. Anchored on REAL endpoints: top = a visits proxy, bottom = real
    // leads count; the two middle steps are interpolated drop-offs.
    const visits = Math.max(leads.length * 4, articles.length * 40, 1);
    const submits = leads.length;
    const funnel = [
      { id: "visit", label: "Landing visit", count: visits },
      { id: "scroll", label: "Scrolled past hero", count: Math.round(visits * 0.71) },
      { id: "cta-view", label: "Saw primary CTA", count: Math.round(visits * 0.41) },
      { id: "cta-click", label: "Clicked CTA", count: Math.round(Math.max(submits * 3, visits * 0.11)) },
      { id: "form-submit", label: "Form submit", count: submits },
    ];

    return { kpis, series, sources, topPages, funnel };
  },
});
