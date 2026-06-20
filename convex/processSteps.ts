import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

// Studio engagement process — public /process stepper reads this; admin editor
// writes. Sorted by `order` so reorder arrows in the admin list take effect.

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("agencyProcessSteps").withIndex("by_order").order("asc").take(200),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("agencyProcessSteps")),
    index: v.number(),
    phase: v.string(),
    blurb: v.string(),
    duration: v.string(),
    deliverables: v.array(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("agencyProcessSteps", data);
  },
});

export const remove = mutation({
  args: { id: v.id("agencyProcessSteps") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
