import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const STATUS = v.union(v.literal("active"), v.literal("prospect"), v.literal("alumni"));

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("agencyClients").take(200),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("agencyClients")),
    name: v.string(),
    industry: v.string(),
    contact: v.string(),
    email: v.string(),
    status: STATUS,
    startedAt: v.number(),
    notes: v.string(),
  },
  handler: async (ctx, { id, ...data }) => {
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("agencyClients", data);
  },
});

export const remove = mutation({
  args: { id: v.id("agencyClients") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
