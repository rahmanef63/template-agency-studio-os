"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Compass, Globe, Layers, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MetricRow, type FeatureItem } from "@/features/_shared";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { CountUp, Stagger } from "@/features/_shared/motion";
import {
  cfgNumber,
  parseConfigObject,
  type FaqItem,
  type PricingTier,
  type StatItem,
  type TestimonialItem,
} from "@/features/_shared/landing/sections";
import type { LandingSection } from "@/features/_shared/landing/types";
import { fmtDate } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import type { Article, Client, Project, Service } from "@/features/_app/types";

/** Agency-studio default content for the shared landing sections — every
 *  value overridable per-section via the admin landing editor's config
 *  JSON (see _shared/landing/sections/config.ts for keys). */

export const AGENCY_FEATURES: FeatureItem[] = [
  { icon: Compass, title: "Strategy first", blurb: "Positioning before pixels — every engagement starts with the why." },
  { icon: Layers, title: "Systems, not assets", blurb: "Tokens, components, and guidelines your team actually adopts." },
  { icon: UserCheck, title: "Principal-led", blurb: "A principal runs every project end-to-end. No handoff to juniors." },
  { icon: Globe, title: "Async-first", blurb: "Two fixed syncs a week, any timezone — progress you can read." },
];

/** Live stats — counted from store data so the band stays seed-coherent
 *  (and updates when admin CRUDs projects/clients/services). */
export function buildAgencyStats(deps: {
  projects: Project[];
  clients: Client[];
  services: Service[];
}): StatItem[] {
  const years = new Date().getFullYear() - Number(DEFAULT_SITE_CONFIG.studioFounded);
  return [
    { value: deps.projects.length, label: "Projects shipped" },
    { value: deps.clients.filter((c) => c.status === "active").length, label: "Active clients" },
    { value: deps.services.length, label: "Engagement formats" },
    { value: years, label: "Years operating" },
  ];
}

export const AGENCY_TESTIMONIALS: TestimonialItem[] = [
  { quote: "They shipped a brand system our own team actually uses — components, tokens, and the why behind every call.", author: "Hana Wibowo", role: "VP Marketing — Northwind Logistics" },
  { quote: "Two-week sprint, zero fluff. The positioning deck still runs our sales narrative a year later.", author: "Diego R.", role: "Head of Product — Cumulus SaaS" },
  { quote: "Launch landed on time and the six-week revisit caught what we missed. Rare discipline.", author: "Maya P.", role: "CEO — Zenith Health" },
  { quote: "Felt embedded, not outsourced. Our designers leveled up just by pairing with them.", author: "Pak Anto", role: "Brand Director — Atlas Group" },
];

export const AGENCY_FAQS: FaqItem[] = [
  { q: "How fast can we start?", a: "Discovery slots open every 2–3 weeks. Send a brief and we respond within 24h with a scope and a start date." },
  { q: "What does an engagement cost?", a: "Productized sprints are fixed-price — see Services. Retainers and multi-month builds are scoped after discovery." },
  { q: "Who actually does the work?", a: "A principal leads every project end-to-end. No handoff to juniors or account managers." },
  { q: "Do you work with remote teams?", a: "Yes — most engagements run async-first with two fixed syncs per week, any timezone." },
];

export const AGENCY_TIERS: PricingTier[] = [
  {
    name: "Project",
    price: "From Rp 65jt",
    blurb: "Fixed-scope sprint — strategy, identity, or a launch site.",
    features: ["Scoped brief + fixed timeline", "Principal-led, no handoffs", "Two structured revision rounds", "Six-week post-launch revisit"],
    ctaLabel: "Send the brief",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
  {
    name: "Retainer",
    price: "Rp 35jt",
    period: "/month",
    blurb: "Design ops partnership on a rolling monthly cadence.",
    features: ["Weekly design sprints", "Design + brand reviews", "Priority booking for new scopes", "Pause or scale any month"],
    featured: true,
    ctaLabel: "Book a call",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
  {
    name: "Embedded team",
    price: "Custom",
    blurb: "A 2–3 person pod inside your product org for multi-month builds.",
    features: ["Design system + product design", "Async-first, in your tools", "Hiring + interview support", "Quarterly roadmap input"],
    ctaLabel: "Talk to us",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
];

/** Default paragraphs for the process-tease `custom` section (CTA comes
 *  from the section's config JSON — see landing-seed). */
export const AGENCY_PROCESS_BODY: string[] = [
  "Empat fase, satu sistem: discovery, design, build, dan six-week revisit. Setiap fase punya scope yang jelas, deliverable yang spesifik, dan tim klien yang terlibat sejak hari satu.",
  "Bukan handoff, tapi adopsi — klien yang dilibatkan sejak awal mengadopsi sistem 3× lebih cepat.",
];

/** Hero sidekick card — selected studio metrics next to the headline. */
export function HeroMetrics() {
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Selected stats
        </p>
        <MetricRow
          rows={[
            { k: "Active clients", v: <CountUp value={14} /> },
            { k: "Projects shipped", v: <span><CountUp value={86} />+</span> },
            { k: "Avg engagement", v: "6 weeks" },
            { k: "NPS", v: <CountUp value={72} /> },
          ]}
        />
      </CardContent>
    </Card>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  "case-study": "Case study",
  essay: "Essay",
  "field-notes": "Field notes",
};

/** Latest published articles teaser — backs the "blog"/"changelog"
 *  landing kinds with real store data (admin CRUD via journal editor). */
export function JournalTeaser({
  section,
  articles,
}: {
  section: LandingSection;
  articles: Article[];
}) {
  const limit = cfgNumber(parseConfigObject(section.config), "limit") ?? 3;
  const latest = articles
    .filter((a) => a.status !== "draft")
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
  if (latest.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHead
        eyebrow="Journal"
        title={section.title}
        subtitle={section.subtitle}
        cta={{ label: "All writing", href: `${PUBLIC_BASE}/journal` }}
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Stagger itemClassName="h-full">
          {latest.map((a) => (
            <Link key={a.id} href={`${PUBLIC_BASE}/journal/${a.slug}`} className="group block h-full">
              <Card className="h-full overflow-hidden border-border/60 bg-card/50 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg">
                <div
                  className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted via-muted/50 to-muted/30 bg-cover bg-center"
                  style={a.cover ? { backgroundImage: `url(${a.cover})` } : undefined}
                  aria-hidden
                >
                  {!a.cover && a.heroEmoji ? (
                    <span className="text-5xl drop-shadow-md">{a.heroEmoji}</span>
                  ) : null}
                  {a.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
                <CardContent className="space-y-2 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge variant="secondary" className="font-normal">
                      {CATEGORY_LABEL[a.category] ?? a.category}
                    </Badge>
                    <span>{fmtDate(a.publishedAt)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {a.readMinutes} min
                    </span>
                  </div>
                  <h3 className="font-medium leading-snug group-hover:underline">{a.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Stagger>
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="outline" size="sm">
          <Link href={`${PUBLIC_BASE}/journal`}>
            All writing <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
