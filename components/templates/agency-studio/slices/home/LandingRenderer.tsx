"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBlock, SectionHead, FeatureGrid, CtaBand } from "@/components/templates/_shared";
import { LandingSectionShell } from "@/components/templates/_shared/landing/LandingSectionShell";
import {
  CustomSection, FaqSection, NewsletterSection,
  PricingSection, StatsSection, TestimonialsSection,
} from "@/components/templates/_shared/landing/sections";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { Stagger } from "@/components/templates/_shared/motion";
import { PUBLIC_BASE } from "../../shared/nav-config";
import { DEFAULT_SITE_CONFIG } from "../../shared/site-config";
import type { Article, Client, Project, Service } from "../../shared/types";
import {
  AGENCY_FAQS,
  AGENCY_FEATURES,
  AGENCY_PROCESS_BODY,
  AGENCY_TESTIMONIALS,
  AGENCY_TIERS,
  HeroMetrics,
  JournalTeaser,
  buildAgencyStats,
} from "./LandingExtras";

interface Deps {
  featured: Project[];
  services: Service[];
  projects: Project[];
  clients: Client[];
  articles: Article[];
  onSubscribe?: (email: string) => Promise<{ ok: boolean; notice?: string }>;
}

/**
 * Maps each enabled landingSection.kind to its agency-studio renderer.
 * Admin-editable title/subtitle thread through; shared-section content
 * defaults live in LandingExtras and are config-JSON overridable.
 */
export function renderLanding(section: LandingSection, deps: Deps) {
  switch (section.kind) {
    case "hero":
      return (
        <LandingSectionShell section={section}>
          <HeroBlock
            variant="split"
            eyebrow={DEFAULT_SITE_CONFIG.studioName}
            title={section.title}
            subtitle={section.subtitle ?? DEFAULT_SITE_CONFIG.description}
            primaryCta={{ label: "Start a project", href: `${PUBLIC_BASE}/contact` }}
            secondaryCta={{ label: "See work", href: `${PUBLIC_BASE}/portfolio` }}
            sidekick={section.imageUrl ? undefined : <HeroMetrics />}
            image={section.imageUrl ? { url: section.imageUrl, ratio: section.imageRatio } : undefined}
          />
        </LandingSectionShell>
      );

    case "stats":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <StatsSection section={section} stats={buildAgencyStats(deps)} clients={deps.clients.map((c) => c.name)} />
        </LandingSectionShell>
      );

    case "features":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHead eyebrow="Why teams pick us" title={section.title} subtitle={section.subtitle} />
            <FeatureGrid items={AGENCY_FEATURES} columns={4} className="mt-10" />
          </div>
        </LandingSectionShell>
      );

    case "portfolio":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHead eyebrow="Featured work" title={section.title} subtitle={section.subtitle} />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Stagger itemClassName="h-full">
              {deps.featured.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`${PUBLIC_BASE}/portfolio/${p.slug}`}
                  className="group block h-full overflow-hidden rounded-lg border border-border/60 bg-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/9] w-full bg-cover bg-center" style={{ backgroundImage: `url(${p.cover})` }} />
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {p.category}
                    </p>
                    <h3 className="mt-1 text-lg font-medium group-hover:underline">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.client}</p>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.blurb}</p>
                  </div>
                </Link>
              ))}
              </Stagger>
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="ghost">
                <Link href={`${PUBLIC_BASE}/portfolio`}>All work <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
          </div>
        </LandingSectionShell>
      );

    case "services":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHead eyebrow="What we do" title={section.title} subtitle={section.subtitle} />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Stagger itemClassName="h-full">
              {deps.services.filter((s) => s.featured).map((s) => (
                <Link
                  key={s.id}
                  href={`${PUBLIC_BASE}/services`}
                  className="group block h-full rounded-lg border border-border/60 bg-card p-6 transition-[translate,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-card/90 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">{s.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{s.duration}</span>
                    <span className="font-mono text-foreground">{s.priceLabel}</span>
                  </div>
                </Link>
              ))}
              </Stagger>
            </div>
          </div>
        </LandingSectionShell>
      );

    case "custom":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60 bg-muted/10">
          <CustomSection section={section} body={AGENCY_PROCESS_BODY} />
        </LandingSectionShell>
      );

    case "testimonials":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60 bg-muted/30">
          <TestimonialsSection section={section} eyebrow="Kind words" items={AGENCY_TESTIMONIALS} />
        </LandingSectionShell>
      );

    case "pricing":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <PricingSection section={section} tiers={AGENCY_TIERS} featuredBadge="Most booked" />
        </LandingSectionShell>
      );

    case "faq":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <FaqSection section={section} items={AGENCY_FAQS} ctaLabel="Hubungi kami" ctaHref={`${PUBLIC_BASE}/contact`} />
        </LandingSectionShell>
      );

    case "blog":
    case "changelog":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <JournalTeaser section={section} articles={deps.articles} />
        </LandingSectionShell>
      );

    case "cta":
      return (
        <LandingSectionShell section={section}>
          <CtaBand
            title={section.title}
            subtitle={section.subtitle ?? "No commitment. We respond within 24h."}
            cta={{ label: "Send the brief", href: `${PUBLIC_BASE}/contact` }}
          />
        </LandingSectionShell>
      );

    case "newsletter":
      return (
        <LandingSectionShell section={section}>
          <NewsletterSection section={section} placeholder="you@company.com" buttonLabel="Subscribe" successText="Thanks — you're on the list." onSubscribe={deps.onSubscribe} />
        </LandingSectionShell>
      );

    default:
      return null;
  }
}
