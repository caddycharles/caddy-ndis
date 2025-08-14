import { QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";
import { ConvexError } from "convex/values";

export async function requireAuth(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }
  return identity;
}

export async function requirePermission(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  _permission: string
) {
  const identity = await requireAuth(ctx);

  // TODO: In Story 2.1, we'll fetch the user from database and check permissions
  // For now, just ensure authentication

  return identity;
}

export async function checkPermission(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  permission: string
): Promise<boolean> {
  try {
    await requirePermission(ctx, permission);
    return true;
  } catch {
    return false;
  }
}
