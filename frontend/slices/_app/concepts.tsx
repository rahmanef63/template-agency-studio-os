"use client";

import * as React from "react";
import { useArticles, useProjects } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type {
  ConceptCard,
  ConceptListAdapter,
} from "@/features/_shared/concepts/ConceptListPage";

/**
 * Per-template CONCEPT REGISTRY — maps a canonical concept to {data selector +
 * field map + link}, consumed by the shared ConceptListPage (default grid via
 * ConceptCardView). Adapter-only: wraps existing selectors, no schema/table/
 * state rename → zero data migration. Every template ships its own copy of this
 * file pointing at its own tables (here: articles + projects), giving one
 * consistent list UI fleet-wide.
 */

const ARTICLE_CATEGORY_LABEL: Record<string, string> = {
  "case-study": "Case study",
  essay: "Essay",
  "field-notes": "Field notes",
};

export const journalAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Journal",
    title: "Tulisan studio + case-study",
    subtitle:
      "Catatan dari proyek, eksperimen design system, dan format workshop yang kami pakai.",
  },
  columns: 3,
  emptyText: "Belum ada tulisan di kategori ini. Reset filter atau publish artikel baru di Admin.",
  hrefFor: (c) => `${PUBLIC_BASE}/journal/${c.slug}`,
  useCards: () => {
    const articles = useArticles();
    return React.useMemo<ConceptCard[]>(
      () =>
        articles
          .filter((a) => a.status !== "draft")
          .sort((a, b) => b.publishedAt - a.publishedAt)
          .map((a) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            cover: a.image ?? a.cover,
            date: a.publishedAt,
            tags: [ARTICLE_CATEGORY_LABEL[a.category] ?? a.category],
          })),
      [articles],
    );
  },
};

export const portfolioAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Selected work",
    title: "Recent client engagements",
    subtitle: "A peek at what we've shipped lately.",
  },
  columns: 3,
  emptyText: "Belum ada karya di kategori ini.",
  hrefFor: (c) => `${PUBLIC_BASE}/portfolio/${c.slug}`,
  useCards: () => {
    const projects = useProjects();
    return React.useMemo<ConceptCard[]>(
      () =>
        projects
          .filter((p) => p.status !== "archived")
          .map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.blurb,
            cover: p.cover,
            tags: [p.category],
          })),
      [projects],
    );
  },
};
