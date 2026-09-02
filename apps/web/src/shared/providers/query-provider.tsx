"use client";

import { getErrorMessage } from "@/src/shared/lib/axios";

import { toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Query Client Factory ────────────────────────────────────
// Creates a fresh QueryClient per component mount (prevents
// shared state between requests in SSR/SSG)

function makeQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute — data is fresh for 1 min
				gcTime: 5 * 60 * 1000, // 5 min — unused data garbage collected after 5 min
				refetchOnWindowFocus: false,
				retry: 1,
			},
			mutations: {
				retry: false,
				onError: (error) => {
					toast.danger(getErrorMessage(error));
				},
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
	if (typeof window === "undefined") {
		// Server: always make a new QueryClient
		return makeQueryClient();
	}
	// Browser: make a new QueryClient if we don't already have one
	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}
	return browserQueryClient;
}

// ── Provider Component ──────────────────────────────────────

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
