/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _shared_auth from "../_shared/auth.js";
import type * as adminPanel_aiConfig from "../adminPanel_aiConfig.js";
import type * as adminPanel_analytics from "../adminPanel_analytics.js";
import type * as adminPanel_auditLog from "../adminPanel_auditLog.js";
import type * as adminPanel_settings from "../adminPanel_settings.js";
import type * as adminPanel_users from "../adminPanel_users.js";
import type * as adminPanel_webhooks from "../adminPanel_webhooks.js";
import type * as aiConfig from "../aiConfig.js";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as backup from "../backup.js";
import type * as clients from "../clients.js";
import type * as comments from "../comments.js";
import type * as features_aiChat_action from "../features/aiChat/action.js";
import type * as features_comments__schema from "../features/comments/_schema.js";
import type * as features_comments_mutation from "../features/comments/mutation.js";
import type * as features_comments_public from "../features/comments/public.js";
import type * as features_comments_query from "../features/comments/query.js";
import type * as features_notion__schema from "../features/notion/_schema.js";
import type * as features_notion_mutation from "../features/notion/mutation.js";
import type * as features_notion_query from "../features/notion/query.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as landing from "../landing.js";
import type * as leads from "../leads.js";
import type * as newsletters from "../newsletters.js";
import type * as pages from "../pages.js";
import type * as processSteps from "../processSteps.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as setup from "../setup.js";
import type * as subscribers from "../subscribers.js";
import type * as team from "../team.js";
import type * as update from "../update.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_shared/auth": typeof _shared_auth;
  adminPanel_aiConfig: typeof adminPanel_aiConfig;
  adminPanel_analytics: typeof adminPanel_analytics;
  adminPanel_auditLog: typeof adminPanel_auditLog;
  adminPanel_settings: typeof adminPanel_settings;
  adminPanel_users: typeof adminPanel_users;
  adminPanel_webhooks: typeof adminPanel_webhooks;
  aiConfig: typeof aiConfig;
  articles: typeof articles;
  auth: typeof auth;
  backup: typeof backup;
  clients: typeof clients;
  comments: typeof comments;
  "features/aiChat/action": typeof features_aiChat_action;
  "features/comments/_schema": typeof features_comments__schema;
  "features/comments/mutation": typeof features_comments_mutation;
  "features/comments/public": typeof features_comments_public;
  "features/comments/query": typeof features_comments_query;
  "features/notion/_schema": typeof features_notion__schema;
  "features/notion/mutation": typeof features_notion_mutation;
  "features/notion/query": typeof features_notion_query;
  files: typeof files;
  http: typeof http;
  landing: typeof landing;
  leads: typeof leads;
  newsletters: typeof newsletters;
  pages: typeof pages;
  processSteps: typeof processSteps;
  projects: typeof projects;
  seed: typeof seed;
  services: typeof services;
  settings: typeof settings;
  setup: typeof setup;
  subscribers: typeof subscribers;
  team: typeof team;
  update: typeof update;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
