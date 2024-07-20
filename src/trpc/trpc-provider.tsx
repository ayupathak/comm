"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, getFetch, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";
import queryClient from "./query-client";
import { env } from "~/env";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${env.NEXT_PUBLIC_VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
          transformer: superjson,
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
