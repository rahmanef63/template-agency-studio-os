"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MetricRow } from "@/features/_shared";
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
import {
  FAQS,
  PRICING,
  PROCESS_BODY,
  TESTIMONIALS,
} from "@/convex/landingContent";
import { FEATURE_ITEMS } from "./feature-config";

/** Agency-studio default landing content lives in convex/landingContent.ts —
 *  the SINGLE source the seed also reads (it writes the same content into
 *  Convex config). These re-exports are the render fallback before the seed
 *  runs; edit the content in that module, not here. Every value is also
 *  overridable per-section via the admin landing editor's config JSON. */

export const AGENCY_FEATURES = FEATURE_ITEMS;

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

export const AGENCY_TESTIMONIALS: TestimonialItem[] = TESTIMONIALS;

export const AGENCY_FAQS: FaqItem[] = FAQS;

export const AGENCY_TIERS: PricingTier[] = PRICING;

/** Default paragraphs for the process-tease `custom` section (CTA comes
 *  from the section's config JSON — see landingContent.PROCESS_CTA / the seed). */
export const AGENCY_PROCESS_BODY: string[] = PROCESS_BODY;

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
