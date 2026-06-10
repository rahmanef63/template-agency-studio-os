"use client";

import type { ReactMutation } from "convex/react";
import type { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { pagesReducer } from "@/components/templates/_shared/pages/reducer";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import type { Action, State } from "./types";

// Content-domain dispatch cases (articles/comments/subscribers/newsletters/
// ai-config/pages/landing), split out of store-dispatch.tsx (move-only) so
// both files stay <=200 LOC. Work-domain cases live in store-dispatch.tsx;
// useConvexDispatch builds the deps object and delegates here via `default:`.

export type ContentDeps = {
  knownIds: {
    articles: Set<string>;
    comments: Set<string>;
    subscribers: Set<string>;
    newsletters: Set<string>;
  };
  pages: State["pages"];
  fail: (e: unknown) => void;
  mArticleUpsert: ReactMutation<typeof api.articles.upsert>;
  mArticleRemove: ReactMutation<typeof api.articles.remove>;
  mCommentUpsert: ReactMutation<typeof api.comments.upsert>;
  mCommentModerate: ReactMutation<typeof api.comments.moderate>;
  mCommentRemove: ReactMutation<typeof api.comments.remove>;
  mSubUpsert: ReactMutation<typeof api.subscribers.upsert>;
  mSubRemove: ReactMutation<typeof api.subscribers.remove>;
  mNewsUpsert: ReactMutation<typeof api.newsletters.upsert>;
  mNewsSend: ReactMutation<typeof api.newsletters.send>;
  mNewsRemove: ReactMutation<typeof api.newsletters.remove>;
  mAiUpdate: ReactMutation<typeof api.aiConfig.update>;
  mAiReset: ReactMutation<typeof api.aiConfig.reset>;
  mPageUpsert: ReactMutation<typeof api.pages.upsert>;
  mPageRemove: ReactMutation<typeof api.pages.remove>;
  mLandingUpsert: ReactMutation<typeof api.landing.upsert>;
  mLandingRemove: ReactMutation<typeof api.landing.remove>;
};

export function dispatchContentCases(action: Action, deps: ContentDeps): void {
  const {
    knownIds, pages, fail,
    mArticleUpsert, mArticleRemove,
    mCommentUpsert, mCommentModerate, mCommentRemove,
    mSubUpsert, mSubRemove,
    mNewsUpsert, mNewsSend, mNewsRemove,
    mAiUpdate, mAiReset,
    mPageUpsert, mPageRemove, mLandingUpsert, mLandingRemove,
  } = deps;
  switch (action.type) {
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
      const next = pagesReducer({ pages }, action);
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
}
