// Clerk authentication configuration for Convex
// This file configures how Convex validates JWTs from Clerk

export default {
  providers: [
    {
      // Your Clerk Frontend API URL (from Clerk Dashboard → API Keys)
      // Format: https://your-app-name.clerk.accounts.dev
      domain: process.env.CLERK_DOMAIN || "https://example.clerk.accounts.dev",
      // For Convex integration, this should be "convex"
      applicationID: "convex",
    },
  ],
};
