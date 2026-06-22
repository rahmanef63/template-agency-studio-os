import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";
import { limitPublicWrite } from "./_shared/rateLimit";

const STATUS = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("unsubscribed"),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    if (!(await optionalUser(ctx))) return [];
    return ctx.db.query("agencySubscribers").order("desc").take(500);
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("agencySubscribers")),
    email: v.string(),
    status: STATUS,
    source: v.string(),
    ts: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("agencySubscribers", data);
  },
});

export const remove = mutation({
  args: { id: v.id("agencySubscribers") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});

// Public newsletter signup from the landing NewsletterSection (onSubscribe).
// Reuses the existing agencySubscribers table + by_email index.
export const subscribe = mutation({
  args: { email: v.string(), source: v.string() },
  handler: async (ctx, { email: rawEmail, source: rawSource }) => {
    // Public anonymous-callable: clamp + validate user-supplied strings.
    const email = rawEmail.slice(0, 320);
    const source = rawSource.slice(0, 500);
    if (!email.includes("@")) throw new Error("Email tidak valid");
    await limitPublicWrite(ctx, "sub", email);
    const existing = await ctx.db
      .query("agencySubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      if (existing.status === "unsubscribed") {
        await ctx.db.patch(existing._id, { status: "pending", ts: Date.now() });
      }
      return existing._id;
    }
    return ctx.db.insert("agencySubscribers", {
      email,
      source,
      status: "pending",
      ts: Date.now(),
    });
  },
});
