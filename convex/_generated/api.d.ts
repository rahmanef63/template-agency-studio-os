/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiConfig from "../aiConfig.js";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as backup from "../backup.js";
import type * as clients from "../clients.js";
import type * as comments from "../comments.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as landing from "../landing.js";
import type * as leads from "../leads.js";
import type * as newsletters from "../newsletters.js";
import type * as pages from "../pages.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as setup from "../setup.js";
import type * as subscribers from "../subscribers.js";
import type * as update from "../update.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiConfig: typeof aiConfig;
  articles: typeof articles;
  auth: typeof auth;
  backup: typeof backup;
  clients: typeof clients;
  comments: typeof comments;
  files: typeof files;
  http: typeof http;
  landing: typeof landing;
  leads: typeof leads;
  newsletters: typeof newsletters;
  pages: typeof pages;
  projects: typeof projects;
  seed: typeof seed;
  services: typeof services;
  settings: typeof settings;
  setup: typeof setup;
  subscribers: typeof subscribers;
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
