import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layouts/app-layout";
import { SkipToContent } from "@/components/skip-to-content";

import appCss from "../styles.css?url";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug logging
if (!clerkPubKey) {
  console.error(
    "VITE_CLERK_PUBLISHABLE_KEY is not set in environment variables"
  );
  console.log("Available env vars:", Object.keys(import.meta.env));
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Caddy - NDIS Support Coordination",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  // For now, don't check for auth routes since useLocation can't be used here
  // We'll wrap all pages with AppLayout

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <SkipToContent />
        <ThemeProvider>
          <ClerkProvider
            publishableKey={clerkPubKey || ""}
            signInUrl="/auth/sign-in"
            signUpUrl="/auth/sign-up"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          >
            <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
              <AppLayout>{children}</AppLayout>
            </ConvexProviderWithClerk>
          </ClerkProvider>
        </ThemeProvider>
        <TanstackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
