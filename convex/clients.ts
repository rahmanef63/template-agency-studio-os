import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";

const STATUS = v.union(v.literal("active"), v.literal("prospect"), v.literal("alumni"));

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("agencyClients").take(200);
    if (await optionalUser(ctx)) return rows;
    // Public landing renders the active-client count + client names. Expose
    // name/industry/status to anon; strip private fields (email/contact/notes).
    // (Cycle 1's blanket [] zeroed the public "clients" stat — this restores it.)
    return rows.map((c) => ({
      _id: c._id,
      _creationTime: c._creationTime,
      name: c.name,
      industry: c.industry,
      status: c.status,
    }));
  },
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
    await requireUser(ctx);
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
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
