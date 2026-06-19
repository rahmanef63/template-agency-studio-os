"use client";

import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHead } from "@/features/_shared/ui/section-head";
import {
  PortfolioListSection,
  type PortfolioItem as SliceItem,
} from "@/features/portfolio-section";
import { useProjects } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type { Project } from "@/features/_app/types";

/**
 * Hybrid wrapper: reads live projects via useProjects() and feeds the
 * canonical PortfolioListSection slice (DRY+SSOT). Admin CRUD edits
 * propagate via the createTemplateStore BroadcastChannel.
 *
 * Motion pass: featured projects surface in an autoplaying carousel
 * above the grid; the read-only rr grid then lists the remaining work.
 */
export function PortfolioListPage() {
  const projects = useProjects().filter((p) => p.status !== "archived");
  const featured = projects.filter((p) => p.featured);
  const showCarousel = featured.length >= 2;
  const gridSource = showCarousel ? projects.filter((p) => !p.featured) : projects;
  const items: SliceItem[] = gridSource.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.blurb,
    client: p.client,
    tags: [p.category],
    cover: { src: p.cover, alt: p.title },
  }));
  return (
    <>
      {showCarousel && (
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 md:pt-24">
          <SectionHead
            eyebrow="Selected work"
            title="Recent client engagements"
            subtitle="A peek at what we've shipped lately."
          />
          <Carousel
            opts={{ align: "start", loop: featured.length > 3 }}
            plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
          >
            <div className="mb-4 flex items-center justify-end gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
            <CarouselContent>
              {featured.map((p) => (
                <CarouselItem key={p.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <FeaturedProjectCard project={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      )}
      <PortfolioListSection
        eyebrow={showCarousel ? undefined : "Selected work"}
        title={showCarousel ? "More work" : "Recent client engagements"}
        items={items}
        hrefFor={(i) => `${PUBLIC_BASE}/portfolio/${i.slug}`}
        layout="uniform"
        columns={3}
      />
    </>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`${PUBLIC_BASE}/portfolio/${project.slug}`}
      className="group block h-full overflow-hidden rounded-lg border border-border/60 bg-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="aspect-[16/9] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${project.cover})` }}
        aria-hidden
      />
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {project.category}
        </p>
        <h3 className="mt-1 text-lg font-medium group-hover:underline">{project.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
      </div>
    </Link>
  );
}
