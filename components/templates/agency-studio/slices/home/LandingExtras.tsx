"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHead } from "@/components/templates/_shared/ui/section-head";
import {
  CountUp,
  Marquee,
  Reveal,
  Stagger,
} from "@/components/templates/_shared/motion";
import { LandingSectionShell } from "@/components/templates/_shared/landing/LandingSectionShell";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { DEFAULT_SITE_CONFIG } from "../../shared/site-config";
import type { Client, Project, Service } from "../../shared/types";

/**
 * Motion-kit renderers for the `stats` / `testimonials` / `faq` landing
 * kinds (formerly generic stubs). Item content is admin-overridable via
 * `section.config` JSON — `{ "items": [...] }` — with studio defaults so
 * the sections render believably out of the box.
 */

/** Parses `section.config` JSON; returns `items` when it's a non-empty array. */
function configItems<T>(config: string | undefined): T[] | null {
  if (!config) return null;
  try {
    const parsed: unknown = JSON.parse(config);
    const arr = (parsed as Record<string, unknown>)?.items;
    return Array.isArray(arr) && arr.length > 0 ? (arr as T[]) : null;
  } catch {
    return null;
  }
}

/** "By the numbers" band — CountUp stats + client-name marquee strip. */
export function StatsBand({
  section,
  projects,
  clients,
  services,
}: {
  section: LandingSection;
  projects: Project[];
  clients: Client[];
  services: Service[];
}) {
  const years =
    new Date().getFullYear() - Number(DEFAULT_SITE_CONFIG.studioFounded);
  const stats = [
    { label: "Projects shipped", value: projects.length },
    { label: "Active clients", value: clients.filter((c) => c.status === "active").length },
    { label: "Engagement formats", value: services.length },
    { label: "Years operating", value: years },
  ];
  return (
    <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHead eyebrow="Track record" title={section.title} subtitle={section.subtitle} />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stagger itemClassName="h-full">
            {stats.map((s) => (
              <Card key={s.label} className="h-full border-border/60">
                <CardContent className="p-5">
                  <p className="text-3xl font-semibold tracking-tight">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Stagger>
        </div>
        {clients.length > 0 && (
          <Marquee className="mt-12" speed={30}>
            {clients.map((c) => (
              <span
                key={c.id}
                className="text-lg font-semibold tracking-tight text-muted-foreground/70"
              >
                {c.name}
              </span>
            ))}
          </Marquee>
        )}
      </div>
    </LandingSectionShell>
  );
}

type Testimonial = { quote: string; author: string; role: string };

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: "They shipped a brand system our own team actually uses — components, tokens, and the why behind every call.", author: "Hana Wibowo", role: "VP Marketing — Northwind Logistics" },
  { quote: "Two-week sprint, zero fluff. The positioning deck still runs our sales narrative a year later.", author: "Diego R.", role: "Head of Product — Cumulus SaaS" },
  { quote: "Launch landed on time and the six-week revisit caught what we missed. Rare discipline.", author: "Maya P.", role: "CEO — Zenith Health" },
  { quote: "Felt embedded, not outsourced. Our designers leveled up just by pairing with them.", author: "Pak Anto", role: "Brand Director — Atlas Group" },
];

/** Autoplaying testimonial carousel (canon: wirausaha TestimoniPage). */
export function TestimonialsCarousel({ section }: { section: LandingSection }) {
  const items = configItems<Testimonial>(section.config) ?? DEFAULT_TESTIMONIALS;
  return (
    <LandingSectionShell section={section} defaultClassName="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHead eyebrow="Kind words" title={section.title} subtitle={section.subtitle} />
        <Carousel
          className="mt-10"
          opts={{ align: "start", loop: items.length > 3 }}
          plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
        >
          <div className="mb-4 flex items-center justify-end gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
          <CarouselContent>
            {items.map((t) => (
              <CarouselItem key={t.author} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/60 bg-card/60">
                  <CardContent className="flex h-full flex-col gap-4 p-6">
                    <Quote className="size-4 text-muted-foreground/50" aria-hidden />
                    <p className="text-sm leading-relaxed text-foreground/90">{t.quote}</p>
                    <div className="mt-auto">
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </LandingSectionShell>
  );
}

type FaqItem = { q: string; a: string };

const DEFAULT_FAQ: FaqItem[] = [
  { q: "How fast can we start?", a: "Discovery slots open every 2–3 weeks. Send a brief and we respond within 24h with a scope and a start date." },
  { q: "What does an engagement cost?", a: "Productized sprints are fixed-price — see Services. Retainers and multi-month builds are scoped after discovery." },
  { q: "Who actually does the work?", a: "A principal leads every project end-to-end. No handoff to juniors or account managers." },
  { q: "Do you work with remote teams?", a: "Yes — most engagements run async-first with two fixed syncs per week, any timezone." },
];

/** FAQ accordion (canon: wirausaha CatalogDetailPage accordion). */
export function FaqAccordion({ section }: { section: LandingSection }) {
  const items = configItems<FaqItem>(section.config) ?? DEFAULT_FAQ;
  return (
    <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHead align="center" eyebrow="FAQ" title={section.title} subtitle={section.subtitle} />
        <Reveal className="mt-8">
          <Accordion
            type="single"
            collapsible
            defaultValue={items[0]?.q}
            className="rounded-xl border border-border/60 bg-card/50 px-4"
          >
            {items.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </LandingSectionShell>
  );
}
