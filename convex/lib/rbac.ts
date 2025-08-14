import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { requireAuth } from "../auth";

// Role definitions
export type Role =
  | "admin"
  | "coordinator"
  | "support_worker"
  | "finance"
  | "viewer";

// Permission definitions
export const PERMISSIONS = {
  // Participant permissions
  "participant:create": ["admin", "coordinator"],
  "participant:read": [
    "admin",
    "coordinator",
    "support_worker",
    "finance",
    "viewer",
  ],
  "participant:update": ["admin", "coordinator"],
  "participant:delete": ["admin"],
  "participant:read:assigned": ["support_worker"],

  // Service permissions
  "service:create": ["admin", "coordinator", "support_worker"],
  "service:read": [
    "admin",
    "coordinator",
    "support_worker",
    "finance",
    "viewer",
  ],
  "service:update": ["admin", "coordinator"],
  "service:delete": ["admin"],
  "service:create:own": ["support_worker"],
  "service:read:own": ["support_worker"],

  // Budget permissions
  "budget:create": ["admin", "coordinator"],
  "budget:read": ["admin", "coordinator", "finance", "viewer"],
  "budget:update": ["admin", "coordinator"],
  "budget:delete": ["admin"],

  // Claim permissions
  "claim:create": ["admin", "coordinator", "finance"],
  "claim:read": ["admin", "coordinator", "finance"],
  "claim:update": ["admin", "finance"],
  "claim:delete": ["admin"],

  // Message permissions
  "message:create": ["admin", "coordinator", "support_worker"],
  "message:read": ["admin", "coordinator", "support_worker"],

  // Admin permissions
  "admin:*": ["admin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Check if a role has a specific permission
export function roleHasPermission(role: Role, permission: Permission): boolean {
  // Admin has all permissions
  if (role === "admin") return true;

  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles
    ? (allowedRoles as readonly string[]).includes(role)
    : false;
}

// Require a specific permission for a user
export async function requirePermissionWithRole(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  permission: Permission
) {
  const identity = await requireAuth(ctx);

  // TODO: In Story 2.1, fetch user from database to get their role
  // For now, just ensure authentication
  const userRole: Role = "viewer"; // Default role for now

  if (!roleHasPermission(userRole, permission)) {
    throw new ConvexError(`Permission denied: ${permission}`);
  }

  return { identity, role: userRole };
}

// Check if user has permission (returns boolean)
export async function checkUserPermission(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  permission: Permission
): Promise<boolean> {
  try {
    await requirePermissionWithRole(ctx, permission);
    return true;
  } catch {
    return false;
  }
}

// Helper to get all permissions for a role
export function getPermissionsForRole(role: Role): Permission[] {
  if (role === "admin") {
    return Object.keys(PERMISSIONS) as Permission[];
  }

  const permissions: Permission[] = [];
  for (const [permission, roles] of Object.entries(PERMISSIONS)) {
    if ((roles as readonly string[]).includes(role)) {
      permissions.push(permission as Permission);
    }
  }

  return permissions;
}
