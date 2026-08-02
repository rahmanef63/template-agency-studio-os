import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

// Studio team members — public Team/About pages read this; admin editor writes.

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("agencyTeam").withIndex("by_order").order("asc").take(200),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("agencyTeam")),
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    avatar: v.string(),
    initials: v.string(),
    location: v.optional(v.string()),
    links: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("agencyTeam", data);
  },
});

export const remove = mutation({
  args: { id: v.id("agencyTeam") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
