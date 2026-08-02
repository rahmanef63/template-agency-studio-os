import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";

// Admin moderation backend for comments.
//
// P0 fix: the public site (comments-section.tsx -> api.features.comments.*)
// reads/writes the `comment_threads` table. Admin moderation now acts on the
// SAME rows — previously it pointed at a separate `agencyComments` table, so
// moderators never saw what visitors actually posted. We read `comment_threads`
// here and map each row into the admin `Comment` DTO the CommentsView expects.

const STATUS = v.union(v.literal("pending"), v.literal("approved"), v.literal("spam"));

// Admin queue: every non-deleted thread row, newest first, mapped to the
// admin Comment DTO. `_id` is kept so the store's withId() maps it to `id`.
export const list = query({
  args: {},
  handler: async (ctx) => {
    if (!(await optionalUser(ctx))) return [];
    const rows = await ctx.db.query("comment_threads").order("desc").take(500);
    return rows
      .filter((r) => !r.deletedAt)
      .map((r) => ({
        _id: r._id,
        _creationTime: r._creationTime,
        postId: r.targetId,
        postTitle: r.postTitle ?? `${r.targetKind}:${r.targetId}`,
        author: r.authorName ?? "Member",
        email: r.authorEmail ?? "",
        body: r.body,
        status: r.status ?? "pending",
        aiFlag: r.aiFlag ?? null,
        ts: r.createdAt,
      }));
  },
});

export const moderate = mutation({
  args: { id: v.id("comment_threads"), status: STATUS },
  handler: async (ctx, { id, status }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("comment_threads") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    // Soft-delete to match the public slice's remove semantics.
    await ctx.db.patch(id, { deletedAt: Date.now(), updatedAt: Date.now() });
  },
});
