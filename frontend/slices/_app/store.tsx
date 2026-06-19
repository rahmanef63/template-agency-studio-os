"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PagesProvider,
  type PagesStore,
} from "@/features/_shared/pages/pages-context";
import type { PageEntry } from "@/features/_shared/pages/types";
import {
  LandingProvider,
  type LandingStore,
} from "@/features/_shared/landing/landing-context";
import type { LandingSection } from "@/features/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import { StoreCtx, useStore, type Ctx } from "./store-context";
import { useConvexDispatch } from "./store-dispatch";
import type { AiConfig, State } from "./types";
import { DEFAULT_AI_CONFIG } from "./ai-config-seed";

// Convex-backed store. Replaces the old localStorage reducer: `state` is
// assembled from live Convex queries; `dispatch` routes each action to the
// matching Convex mutation (see store-dispatch.tsx). Consuming slices are
// UNCHANGED — they still call useStore()/useX()/dispatch(action).
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh nid -> insert.

const withId = <T,>(rows: ReadonlyArray<Record<string, unknown>> | undefined): T[] =>
  ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({ ...r, id: r._id })) as T[];

function Provider({ children }: { children: React.ReactNode }) {
  const projects = useQuery(api.projects.listAll, {});
  const clients = useQuery(api.clients.list, {});
  const services = useQuery(api.services.list, {});
  const leads = useQuery(api.leads.list, {});
  const articles = useQuery(api.articles.list, {});
  const team = useQuery(api.team.list, {});
  const comments = useQuery(api.comments.list, {});
  const subscribers = useQuery(api.subscribers.list, {});
  const newsletters = useQuery(api.newsletters.list, {});
  const aiConfigRow = useQuery(api.aiConfig.get, {});
  const pageRows = useQuery(api.pages.list, {});
  const landingRows = useQuery(api.landing.list, {});

  const queries = [
    projects, clients, services, leads, articles, team, comments,
    subscribers, newsletters, aiConfigRow, pageRows, landingRows,
  ];
  const ready = queries.every((q) => q !== undefined);
  const progress = Math.round((queries.filter((q) => q !== undefined).length / queries.length) * 100);

  const state = React.useMemo<State>(
    () => ({
      projects: withId(projects),
      clients: withId(clients),
      services: withId(services),
      leads: withId(leads),
      articles: withId(articles),
      team: withId(team),
      comments: withId(comments),
      subscribers: withId(subscribers),
      newsletters: withId(newsletters),
      aiConfig: aiConfigRow ? aiConfigStripSystem(aiConfigRow) : DEFAULT_AI_CONFIG,
      pages: (pageRows ?? []) as PageEntry[],
      landingSections: (landingRows ?? []) as LandingSection[],
    }),
    [projects, clients, services, leads, articles, team, comments, subscribers, newsletters, aiConfigRow, pageRows, landingRows],
  );

  const dispatch = useConvexDispatch(state);

  const value = React.useMemo<Ctx>(
    () => ({ state, dispatch, ready, progress }),
    [state, dispatch, ready, progress],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

// Drop Convex system fields off the singleton ai-config row.
function aiConfigStripSystem(row: Record<string, unknown>): AiConfig {
  const { _id, _creationTime, ...rest } = row;
  void _id;
  void _creationTime;
  return rest as unknown as AiConfig;
}

function PagesAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<PagesStore>(
    () => ({
      pages: state.pages,
      create: (entry: PageEntry) => dispatch({ type: "PAGE_CREATE", payload: entry }),
      update: (id, patch) => dispatch({ type: "PAGE_UPDATE", payload: { id, patch } }),
      remove: (id: string) => dispatch({ type: "PAGE_DELETE", payload: { id } }),
      reorderBlock: (id, from, to) =>
        dispatch({ type: "PAGE_REORDER_BLOCK", payload: { id, from, to } }),
      upsertSection: (pageId, section) =>
        dispatch({ type: "PAGE_SECTION_UPSERT", payload: { pageId, section } }),
      removeSection: (pageId, sectionId) =>
        dispatch({ type: "PAGE_SECTION_DELETE", payload: { pageId, sectionId } }),
    }),
    [state.pages, dispatch],
  );
  return <PagesProvider value={value}>{children}</PagesProvider>;
}

function LandingAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<LandingStore>(
    () => ({
      items: state.landingSections,
      publicBase: PUBLIC_BASE,
      adminBase: ADMIN_BASE,
      create: (section: LandingSection) =>
        dispatch({ type: "LANDING_UPSERT", payload: section }),
      update: (id, patch) => {
        const current = state.landingSections.find((s) => s.id === id);
        if (!current) return;
        dispatch({ type: "LANDING_UPSERT", payload: { ...current, ...patch, id } });
      },
      remove: (id: string) => dispatch({ type: "LANDING_DELETE", payload: { id } }),
    }),
    [state.landingSections, dispatch],
  );
  return <LandingProvider value={value}>{children}</LandingProvider>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <PagesAdapter>
        <LandingAdapter>{children}</LandingAdapter>
      </PagesAdapter>
    </Provider>
  );
}

export { useStore };

export const useProjects = () => useStore().state.projects;
export const useFeaturedProjects = () => useProjects().filter((p) => p.featured);
export const useProject = (slug: string) => useProjects().find((p) => p.slug === slug) ?? null;
export const useClients = () => useStore().state.clients;
export const useServices = () => useStore().state.services;
export const useLeads = () => useStore().state.leads;
export const useArticles = () => useStore().state.articles;
export const useArticle = (slug: string) => useArticles().find((a) => a.slug === slug) ?? null;
export const useTeam = () => useStore().state.team;
export const useComments = () => useStore().state.comments;
export const useSubscribers = () => useStore().state.subscribers;
export const useNewsletters = () => useStore().state.newsletters;
export const useAiConfig = () => useStore().state.aiConfig;
export const usePages = () => useStore().state.pages;
export const useLandingSections = () => useStore().state.landingSections;

export { nid, fmtDate, rel } from "@/features/_shared/utils";
