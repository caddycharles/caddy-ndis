import { v } from "convex/values";
// @ts-ignore - Generated types will be available when convex dev runs
import { internalMutation, mutation, query } from "./_generated/server";
import { requireAuth } from "./auth";

// Create or update user from Clerk webhook
export const upsertUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    // This will be called by the webhook, so no auth required
    // In Story 2.1, we'll implement the full user table
    // For now, just log the user creation
    console.log("User upserted:", args);

    // TODO: Story 2.1 - Create users table and store user data
    return { success: true };
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);

    // TODO: Story 2.1 - Fetch user from database
    // For now, return basic identity info
    return {
      clerkId: identity.subject,
      email: identity.email,
      name: identity.name,
    };
  },
});

// Delete user (for webhook)
export const deleteUser = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (_ctx, args) => {
    // This will be called by the webhook, so no auth required
    console.log("User deleted:", args.clerkId);

    // TODO: Story 2.1 - Delete user from database
    return { success: true };
  },
});
