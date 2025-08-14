import { ReactNode } from "react";
// import { useQuery } from 'convex/react' // Will be used when convex dev runs
// import { api } from '../convex/_generated/api' // Will be generated when convex dev runs

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  permission: _permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  // TODO: In Story 2.1, we'll implement the actual permission check query
  // For now, we'll just render children if authenticated
  const hasPermission = true; // Placeholder

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  // TODO: In Story 2.1, we'll implement the actual role check
  // For now, we'll just render children if authenticated
  const userRole = "viewer"; // Placeholder

  if (!roles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
