"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { IS_DEMO } from "@/lib/stage";
import { reducer } from "./store-reducer";
import { saveDemoState, broadcastAction, openDemoChannel } from "@/lib/demo-store";
import type { Action, State } from "./types";
import { dispatchContentCases } from "./store-dispatch-cases";

// DEMO dispatch: every action runs through the same pure `reducer`, the next
// State is persisted to localStorage, and the action is broadcast so the
// sibling iframe (public<->admin) re-renders live. Mounted only when
// NEXT_PUBLIC_DEMO=1 (see store.tsx DemoProvider); replaces the Convex mutation
// path for the demo. Real clones never call this — they use useConvexDispatch.
export function useDemoDispatch(
  setState: React.Dispatch<React.SetStateAction<State>>,
): (a: Action) => void {
  // One channel per provider instance; closed on unmount.
  const channelRef = React.useRef<BroadcastChannel | null>(null);
  React.useEffect(() => {
    channelRef.current = openDemoChannel();
    return () => channelRef.current?.close();
  }, []);

  return React.useCallback(
    (action: Action) => {
      setState((s) => {
        const next = reducer(s, action);
        saveDemoState(next);
        return next;
      });
      broadcastAction(channelRef.current, action);
    },
    [setState],
  );
}

// Dispatch wiring, split out of store.tsx (move-only): routes each store
// action to the matching Convex mutation. `id` is passed to upsert only when
// it's a known Convex id (existing row); a fresh nid -> insert.
// Work-domain cases (projects/clients/services/leads) live here; content
// cases (articles/comments/subscribers/newsletters/ai-config/pages/landing)
// live in store-dispatch-cases.tsx so both files stay <=200 LOC.

export function useConvexDispatch(state: State): (a: Action) => void {
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
  const mTeamUpsert = useMutation(api.team.upsert);
  const mTeamRemove = useMutation(api.team.remove);
  const mProcessUpsert = useMutation(api.processSteps.upsert);
  const mProcessRemove = useMutation(api.processSteps.remove);
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
      team: new Set(state.team.map((t) => t.id)),
      processSteps: new Set(state.processSteps.map((p) => p.id)),
      comments: new Set(state.comments.map((c) => c.id)),
      subscribers: new Set(state.subscribers.map((s) => s.id)),
      newsletters: new Set(state.newsletters.map((n) => n.id)),
    }),
    [state],
  );

  return React.useCallback(
    (action: Action) => {
      // PUBLIC-demo isolation: never write to the shared Convex DB from the
      // showcase (NEXT_PUBLIC_DEMO=1). Reads (useQuery) keep showing seed
      // content; only writes are blocked. No-op on real clones / owner deploy.
      if (IS_DEMO) {
        toast.info("Mode demo — clone template untuk menyimpan perubahan");
        return;
      }
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

        default:
          dispatchContentCases(action, {
            knownIds, pages: state.pages, fail,
            mArticleUpsert, mArticleRemove,
            mTeamUpsert, mTeamRemove,
            mProcessUpsert, mProcessRemove,
            mCommentModerate, mCommentRemove,
            mSubUpsert, mSubRemove,
            mNewsUpsert, mNewsSend, mNewsRemove,
            mAiUpdate, mAiReset,
            mPageUpsert, mPageRemove, mLandingUpsert, mLandingRemove,
          });
      }
    },
    [knownIds, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
