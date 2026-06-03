"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  PagesProvider,
  type PagesStore,
} from "@/components/templates/_shared/pages/pages-context";
import type { PageEntry } from "@/components/templates/_shared/pages/types";
import { pagesReducer } from "@/components/templates/_shared/pages/reducer";
import {
  LandingProvider,
  type LandingStore,
} from "@/components/templates/_shared/landing/landing-context";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import type { Action, AiConfig, State } from "./types";
import { DEFAULT_AI_CONFIG } from "./ai-config-seed";

// Convex-backed store. Replaces the old localStorage reducer: `state` is
// assembled from live Convex queries; `dispatch` routes each action to the
// matching Convex mutation. Consuming slices are UNCHANGED — they still call
// useStore()/useX()/dispatch(action).
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh nid -> insert.

type Ctx = { state: State; dispatch: (a: Action) => void; ready: boolean; progress: number };
const StoreCtx = React.createContext<Ctx | null>(null);

const withId = <T,>(rows: ReadonlyArray<Record<string, unknown>> | undefined): T[] =>
  ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({ ...r, id: r._id })) as T[];

function Provider({ children }: { children: React.ReactNode }) {
  const projects = useQuery(api.projects.listAll, {});
  const clients = useQuery(api.clients.list, {});
  const services = useQuery(api.services.list, {});
  const leads = useQuery(api.leads.list, {});
  const articles = useQuery(api.articles.list, {});
  const comments = useQuery(api.comments.list, {});
  const subscribers = useQuery(api.subscribers.list, {});
  const newsletters = useQuery(api.newsletters.list, {});
  const aiConfigRow = useQuery(api.aiConfig.get, {});
  const pageRows = useQuery(api.pages.list, {});
  const landingRows = useQuery(api.landing.list, {});

  const queries = [
    projects, clients, services, leads, articles, comments,
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
      comments: withId(comments),
      subscribers: withId(subscribers),
      newsletters: withId(newsletters),
      aiConfig: aiConfigRow ? aiConfigStripSystem(aiConfigRow) : DEFAULT_AI_CONFIG,
      pages: (pageRows ?? []) as PageEntry[],
      landingSections: (landingRows ?? []) as LandingSection[],
    }),
    [projects, clients, services, leads, articles, comments, subscribers, newsletters, aiConfigRow, pageRows, landingRows],
  );

  // ---- mutations ----
  const mProjectUpsert = useMutation(api.projects.upsert);
  const mProjectRemove = useMutation(api.projects.remove);
  const mClientUpsert = useMutation(api.clients.upsert);
  const mClientRemove = useMutation(api.clients.remove);
  const mServiceUpsert = useMutation(api.services.upsert);
  const mServiceRemove = useMutation(api.services.remove);
  const mLeadCreate = useMutation(api.leads.create);
  const mLeadUpdate = useMutation(api.leads.update);
  const mLeadRemove = useMutation(api.leads.remove);
  const mArticleUpsert = useMutation(api.articles.upsert);
  const mArticleRemove = useMutation(api.articles.remove);
  const mCommentUpsert = useMutation(api.comments.upsert);
  const mCommentModerate = useMutation(api.comments.moderate);
  const mCommentRemove = useMutation(api.comments.remove);
  const mSubUpsert = useMutation(api.subscribers.upsert);
  const mSubRemove = useMutation(api.subscribers.remove);
  const mNewsUpsert = useMutation(api.newsletters.upsert);
  const mNewsSend = useMutation(api.newsletters.send);
  const mNewsRemove = useMutation(api.newsletters.remove);
  const mAiUpdate = useMutation(api.aiConfig.update);
  const mAiReset = useMutation(api.aiConfig.reset);
  const mPageUpsert = useMutation(api.pages.upsert);
  const mPageRemove = useMutation(api.pages.remove);
  const mLandingUpsert = useMutation(api.landing.upsert);
  const mLandingRemove = useMutation(api.landing.remove);

  const knownIds = React.useMemo(
    () => ({
      projects: new Set(state.projects.map((p) => p.id)),
      clients: new Set(state.clients.map((c) => c.id)),
      services: new Set(state.services.map((s) => s.id)),
      articles: new Set(state.articles.map((a) => a.id)),
      comments: new Set(state.comments.map((c) => c.id)),
      subscribers: new Set(state.subscribers.map((s) => s.id)),
      newsletters: new Set(state.newsletters.map((n) => n.id)),
    }),
    [state],
  );

  const dispatch = React.useCallback(
    (action: Action) => {
      const fail = (e: unknown) => console.error(`[store] ${action.type} failed`, e);
      switch (action.type) {
        case "project.upsert": {
          const { id, ...d } = action.project;
          void (knownIds.projects.has(id)
            ? mProjectUpsert({ id: id as Id<"agencyProjects">, ...d })
            : mProjectUpsert(d)
          ).catch(fail);
          break;
        }
        case "project.delete":
          void mProjectRemove({ id: action.id as Id<"agencyProjects"> }).catch(fail);
          break;

        case "client.upsert": {
          const { id, ...d } = action.client;
          void (knownIds.clients.has(id)
            ? mClientUpsert({ id: id as Id<"agencyClients">, ...d })
            : mClientUpsert(d)
          ).catch(fail);
          break;
        }
        case "client.delete":
          void mClientRemove({ id: action.id as Id<"agencyClients"> }).catch(fail);
          break;

        case "service.upsert": {
          const { id, ...d } = action.service;
          void (knownIds.services.has(id)
            ? mServiceUpsert({ id: id as Id<"agencyServices">, ...d })
            : mServiceUpsert(d)
          ).catch(fail);
          break;
        }
        case "service.delete":
          void mServiceRemove({ id: action.id as Id<"agencyServices"> }).catch(fail);
          break;

        case "lead.create": {
          const { id: _id, ...d } = action.lead;
          void mLeadCreate(d).catch(fail);
          break;
        }
        case "lead.update":
          void mLeadUpdate({
            id: action.id as Id<"agencyLeads">,
            status: action.patch.status,
            topic: action.patch.topic,
            budget: action.patch.budget,
          }).catch(fail);
          break;
        case "lead.delete":
          void mLeadRemove({ id: action.id as Id<"agencyLeads"> }).catch(fail);
          break;

        case "article.upsert": {
          const { id, ...d } = action.article;
          void (knownIds.articles.has(id)
            ? mArticleUpsert({ id: id as Id<"agencyArticles">, ...d })
            : mArticleUpsert(d)
          ).catch(fail);
          break;
        }
        case "article.delete":
          void mArticleRemove({ id: action.id as Id<"agencyArticles"> }).catch(fail);
          break;

        case "comment.upsert": {
          const { id, ...d } = action.comment;
          void (knownIds.comments.has(id)
            ? mCommentUpsert({ id: id as Id<"agencyComments">, ...d })
            : mCommentUpsert(d)
          ).catch(fail);
          break;
        }
        case "comment.moderate":
          void mCommentModerate({ id: action.id as Id<"agencyComments">, status: action.status }).catch(fail);
          break;
        case "comment.delete":
          void mCommentRemove({ id: action.id as Id<"agencyComments"> }).catch(fail);
          break;

        case "subscriber.upsert": {
          const { id, ...d } = action.sub;
          void (knownIds.subscribers.has(id)
            ? mSubUpsert({ id: id as Id<"agencySubscribers">, ...d })
            : mSubUpsert(d)
          ).catch(fail);
          break;
        }
        case "subscriber.delete":
          void mSubRemove({ id: action.id as Id<"agencySubscribers"> }).catch(fail);
          break;

        case "newsletter.upsert": {
          const { id, ...d } = action.draft;
          void (knownIds.newsletters.has(id)
            ? mNewsUpsert({ id: id as Id<"agencyNewsletters">, ...d })
            : mNewsUpsert(d)
          ).catch(fail);
          break;
        }
        case "newsletter.send":
          void mNewsSend({ id: action.id as Id<"agencyNewsletters"> }).catch(fail);
          break;
        case "newsletter.delete":
          void mNewsRemove({ id: action.id as Id<"agencyNewsletters"> }).catch(fail);
          break;

        case "ai-config.update":
          void mAiUpdate(action.patch).catch(fail);
          break;
        case "ai-config.reset":
          void mAiReset({}).catch(fail);
          break;

        case "PAGE_DELETE":
          void mPageRemove({ entryId: action.payload.id }).catch(fail);
          break;
        case "PAGE_CREATE":
        case "PAGE_UPDATE":
        case "PAGE_REORDER_BLOCK":
        case "PAGE_SECTION_UPSERT":
        case "PAGE_SECTION_DELETE": {
          const next = pagesReducer({ pages: state.pages }, action);
          const pid =
            (action.payload as { id?: string; pageId?: string }).id ??
            (action.payload as { pageId?: string }).pageId;
          const entry = next.pages.find((p) => p.id === pid);
          if (entry) void mPageUpsert({ entryId: entry.id, slug: entry.slug, data: entry }).catch(fail);
          break;
        }

        case "LANDING_UPSERT": {
          const s = action.payload as LandingSection;
          void mLandingUpsert({ sectionId: s.id, data: s }).catch(fail);
          break;
        }
        case "LANDING_DELETE":
          void mLandingRemove({ sectionId: (action.payload as { id: string }).id }).catch(fail);
          break;

        case "hydrate":
        case "reset":
          // Convex is the source of truth — no-op.
          break;
      }
    },
    [knownIds, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );

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

function useStore() {
  const c = React.useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside <StoreProvider>");
  return c;
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
export const useComments = () => useStore().state.comments;
export const useSubscribers = () => useStore().state.subscribers;
export const useNewsletters = () => useStore().state.newsletters;
export const useAiConfig = () => useStore().state.aiConfig;
export const usePages = () => useStore().state.pages;
export const useLandingSections = () => useStore().state.landingSections;

export { nid, fmtDate, rel } from "@/components/templates/_shared/utils";
