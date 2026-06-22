import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";
import { limitPublicWrite } from "./_shared/rateLimit";

const STATUS = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("qualified"),
  v.literal("won"),
  v.literal("lost"),
);

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    if (!(await optionalUser(ctx))) return [];
    if (status) {
      return ctx.db
        .query("agencyLeads")
        .withIndex("by_status", (q) => q.eq("status", status as never))
        .take(200);
    }
    return ctx.db.query("agencyLeads").take(200);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    topic: v.string(),
    source: v.string(),
    budget: v.optional(v.string()),
    status: v.optional(STATUS),
    ts: v.optional(v.number()),
  },
  handler: async (ctx, { status, ts, ...data }) => {
    // Public anonymous-callable: clamp user-supplied strings before insert.
    const clean = {
      name: data.name.slice(0, 200),
      company: data.company.slice(0, 200),
      email: data.email.slice(0, 320),
      phone: data.phone?.slice(0, 500),
      topic: data.topic.slice(0, 5000),
      source: data.source.slice(0, 500),
      budget: data.budget?.slice(0, 500),
    };
    if (!clean.email.includes("@")) throw new Error("Email tidak valid");
    await limitPublicWrite(ctx, "lead", clean.email);
    return ctx.db.insert("agencyLeads", {
      ...clean,
      status: status ?? "new",
      ts: ts ?? Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agencyLeads"),
    status: v.optional(STATUS),
    topic: v.optional(v.string()),
    budget: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUser(ctx);
    const clean: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(patch)) if (val !== undefined) clean[k] = val;
    await ctx.db.patch(id, clean);
  },
});

export const remove = mutation({
  args: { id: v.id("agencyLeads") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
