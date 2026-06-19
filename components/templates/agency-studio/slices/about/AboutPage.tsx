"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_SITE_CONFIG } from "../../shared/site-config";
import { SectionHead } from "@/components/templates/_shared/ui/section-head";
import { Reveal, Stagger } from "@/components/templates/_shared/motion";
import { useTeam } from "../../shared/store";

const VALUES = [
  { k: "Strategy first", v: "Every visual move ties back to a positioning bet." },
  { k: "Build with you", v: "Embedded sprints — your team learns the system, not just the deliverable." },
  { k: "Ship to learn",  v: "We measure adoption, not pixels. Six-week revisits, free." },
];

export function AboutPage() {
  const c = DEFAULT_SITE_CONFIG;
  const team = useTeam();
  const settings = useQuery(api.settings.get);
  const DEFAULT_HEADLINE = `${c.studioName} — founded ${c.studioFounded}`;
  const DEFAULT_INTRO = c.description;
  const headline = settings?.aboutHeadline || DEFAULT_HEADLINE;
  const intro = settings?.seoDescription || DEFAULT_INTRO;
  const photo = settings?.aboutImageUrl;
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={headline}
          className="mb-6 h-40 w-40 rounded-2xl border border-border/60 object-cover"
        />
      )}
      <SectionHead
        eyebrow="About"
        title={headline}
        subtitle={intro}
      />
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Stagger itemClassName="h-full">
        {VALUES.map((v) => (
          <Card
            key={v.k}
            className="h-full border-border/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="p-5">
              <p className="font-medium">{v.k}</p>
              <p className="mt-2 text-sm text-muted-foreground">{v.v}</p>
            </CardContent>
          </Card>
        ))}
        </Stagger>
      </section>
      <Reveal>
      <section className="mt-14">
        <h2 className="text-lg font-medium">Team</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {team.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-md border border-border/60 p-3">
              <div className="grid size-10 place-items-center rounded-full bg-muted text-xs font-medium">{t.initials}</div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      </Reveal>
    </div>
  );
}
