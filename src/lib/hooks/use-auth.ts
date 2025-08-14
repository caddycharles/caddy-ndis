import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";

export function useAuth() {
  const { isLoaded: clerkLoaded, userId, sessionId, signOut } = useClerkAuth();
  const { isLoading: convexLoading, isAuthenticated: convexAuthenticated } =
    useConvexAuth();
  const { user } = useUser();

  return {
    isLoading: !clerkLoaded || convexLoading,
    isAuthenticated: !!userId && convexAuthenticated,
    userId,
    sessionId,
    user,
    signOut,
  };
}
