import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { commentsTables } from "./features/comments/_schema";
import { notionTables } from "./features/notion/_schema";

// Agency Studio OS — full schema (Convex target).
// authTables = @convex-dev/auth. Content tables mirror the localStorage shape
// the frontend store used, so the Convex-backed store adapter maps 1:1.
export default defineSchema({
  ...authTables,

  // Fixed-window rate-limit counters for anonymous public mutations. Additive +
  // empty on deploy; rows reused in place per key. See convex/_shared/rateLimit.ts.
  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("by_key", ["key"]),
  ...commentsTables,
  ...notionTables,

  agencyProjects: defineTable({
    slug: v.string(),
    title: v.string(),
    client: v.string(),
    category: v.string(),
    cover: v.string(),
    icon: v.optional(v.string()),
    blurb: v.string(),
    brief: v.string(),
    outcome: v.string(),
    status: v.union(
      v.literal("discovery"),
      v.literal("design"),
      v.literal("build"),
      v.literal("delivered"),
      v.literal("archived"),
    ),
    publishedAt: v.number(),
    featured: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"]),

  agencyClients: defineTable({
    name: v.string(),
    industry: v.string(),
    contact: v.string(),
    email: v.string(),
    status: v.union(v.literal("active"), v.literal("prospect"), v.literal("alumni")),
    startedAt: v.number(),
    notes: v.string(),
  }).index("by_status", ["status"]),

  agencyServices: defineTable({
    slug: v.string(),
    name: v.string(),
    blurb: v.string(),
    priceLabel: v.string(),
    duration: v.string(),
    bullets: v.array(v.string()),
    featured: v.boolean(),
  }).index("by_slug", ["slug"]),

  // Public /process stepper. `index` is the displayed phase number; `order`
  // drives sort + admin reorder arrows (mirrors agencyTeam.by_order).
  agencyProcessSteps: defineTable({
    index: v.number(),
    phase: v.string(),
    blurb: v.string(),
    duration: v.string(),
    deliverables: v.array(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  agencyLeads: defineTable({
    name: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    topic: v.string(),
    source: v.string(),
    budget: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("won"),
      v.literal("lost"),
    ),
    ts: v.number(),
  }).index("by_status", ["status"]),

  agencyArticles: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    category: v.union(
      v.literal("case-study"),
      v.literal("essay"),
      v.literal("field-notes"),
    ),
    author: v.string(),
    readMinutes: v.number(),
    publishedAt: v.number(),
    cover: v.optional(v.string()),
    image: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    heroEmoji: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  })
    .index("by_slug", ["slug"])
    .index("by_publishedAt", ["publishedAt"]),

  // postId is the FRONTEND article id (plain string) — comments match articles
  // client-side by id/title, no Convex FK. Keeps seed + restore trivial.
  agencyComments: defineTable({
    postId: v.string(),
    postTitle: v.string(),
    author: v.string(),
    email: v.string(),
    body: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("spam")),
    aiFlag: v.optional(v.union(v.literal("spam"), v.literal("toxic"), v.null())),
    ts: v.number(),
  }).index("by_status", ["status"]),

  agencyTeam: defineTable({
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    avatar: v.string(),
    initials: v.string(),
    location: v.optional(v.string()),
    // Serialized [{label,href}] link chips (stored as JSON to keep the editor
    // a single text field; parsed client-side with a safe fallback).
    links: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  agencySubscribers: defineTable({
    email: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("unsubscribed"),
    ),
    source: v.string(),
    ts: v.number(),
  }).index("by_email", ["email"]),

  agencyNewsletters: defineTable({
    subject: v.string(),
    preheader: v.string(),
    body: v.string(),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("sent")),
    sentAt: v.number(),
    recipients: v.number(),
    ts: v.number(),
  }),

  // Singleton AI assistant config. One row.
  agencyAiConfig: defineTable({
    model: v.string(),
    tone: v.string(),
    temperature: v.number(),
    systemPrompt: v.string(),
    playgroundDraft: v.string(),
    playgroundResponse: v.string(),
  }),

  // Page-builder + landing: complex nested structures stored as blobs keyed by
  // the frontend's string id (PageEntry.id / LandingSection.id).
  pages: defineTable({
    entryId: v.string(),
    slug: v.string(),
    data: v.any(),
  })
    .index("by_entryId", ["entryId"])
    .index("by_slug", ["slug"]),

  landingSections: defineTable({
    sectionId: v.string(),
    data: v.any(),
  }).index("by_sectionId", ["sectionId"]),

  // Singleton site config — onboarding wizard + admin Settings write this.
  siteSettings: defineTable({
    siteName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactAddress: v.optional(v.string()),
    brandColor: v.optional(v.string()),
    themeDefault: v.optional(v.string()),
    themePreset: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    socials: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    aboutHeadline: v.optional(v.string()),
    aboutImageUrl: v.optional(v.string()),
    analyticsId: v.optional(v.string()),
    onboardedAt: v.optional(v.number()),
  }),

  // Admin-panel "AI config" block. Singleton row holding the active model +
  // sampling config (mirrors the AiConfig type). One row.
  adminAiConfig: defineTable({
    activeModelId: v.string(),
    systemPrompt: v.string(),
    temperature: v.number(),
    maxOutputTokens: v.number(),
  }),

  // Admin-panel "AI config" moderation rules. One row per rule, keyed by the
  // frontend's stable string id (ModerationRule.id).
  adminModerationRules: defineTable({
    ruleId: v.string(),
    label: v.string(),
    description: v.string(),
    enabled: v.boolean(),
    threshold: v.optional(v.number()),
  }).index("by_ruleId", ["ruleId"]),

  // Admin-panel "Settings" block — WORKSPACE settings (distinct from the
  // public siteSettings singleton). Identity = one row; integrations + apiKeys
  // = one row each keyed by their stable frontend string id.
  adminWorkspaceSettings: defineTable({
    name: v.string(),
    slug: v.string(),
    timezone: v.string(),
    language: v.string(),
    contactEmail: v.string(),
  }),

  adminIntegrations: defineTable({
    integrationId: v.string(),
    label: v.string(),
    category: v.union(
      v.literal("messaging"),
      v.literal("email"),
      v.literal("payments"),
      v.literal("deploy"),
      v.literal("vcs"),
    ),
    status: v.union(
      v.literal("connected"),
      v.literal("disconnected"),
      v.literal("error"),
    ),
    detail: v.string(),
    docsUrl: v.string(),
  }).index("by_integrationId", ["integrationId"]),

  adminApiKeys: defineTable({
    keyId: v.string(),
    label: v.string(),
    tail: v.string(),
    createdAt: v.string(),
    lastUsedAt: v.optional(v.string()),
    scope: v.union(v.literal("read"), v.literal("read-write"), v.literal("admin")),
  }).index("by_keyId", ["keyId"]),

  // Admin-panel "Webhooks" block — endpoints + deliveries (auth-guarded). Keyed
  // by a stable frontend string id (whId / dlId) so the binding's `id: string`
  // contract holds without leaking Convex _id into the view.
  adminWebhooks: defineTable({
    whId: v.string(),
    url: v.string(),
    description: v.string(),
    events: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("failing"),
    ),
    secretTail: v.string(),
    lastDeliveryAt: v.union(v.string(), v.null()),
    failingRetries: v.number(),
  }).index("by_whId", ["whId"]),

  adminWebhookDeliveries: defineTable({
    dlId: v.string(),
    endpointId: v.string(), // the endpoint's whId
    event: v.string(),
    at: v.string(),
    httpCode: v.number(),
    status: v.union(
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("pending"),
      v.literal("retry"),
    ),
    durationMs: v.number(),
    attempt: v.number(),
  }).index("by_endpointId", ["endpointId"]),

  // Admin-panel "Audit log" block — real admin-activity stream. Rows are
  // appended by the other admin mutations (users.changeRole/revoke,
  // webhooks.add/remove/fire, aiConfig.setConfig/reset, settings.setIdentity/
  // revokeKey) via the shared logAudit() helper. Keyed by a stable frontend
  // string id (evId) so the binding's `id: string` contract holds.
  adminAuditEvents: defineTable({
    evId: v.string(),
    at: v.string(), // ISO datetime
    actorId: v.string(),
    actorName: v.string(),
    actorInitials: v.string(),
    actorRole: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
      v.literal("system"),
    ),
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("publish"),
      v.literal("unpublish"),
      v.literal("invite"),
      v.literal("revoke"),
      v.literal("login"),
      v.literal("logout"),
      v.literal("export"),
    ),
    entityType: v.union(
      v.literal("page"),
      v.literal("user"),
      v.literal("role"),
      v.literal("webhook"),
      v.literal("setting"),
      v.literal("post"),
      v.literal("workflow"),
      v.literal("session"),
    ),
    entityId: v.string(),
    entityLabel: v.string(),
    severity: v.union(v.literal("info"), v.literal("warn"), v.literal("alert")),
    diffSummary: v.optional(v.string()),
  }).index("by_at", ["at"]),

  // Admin-panel "Users" block — role mapping over the @convex-dev/auth `users`
  // table (which stays untouched). One row per user whose role has been changed
  // from the derived default. revoke = delete the row (user drops to default).
  adminRoles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
    ),
  }).index("by_userId", ["userId"]),
});
