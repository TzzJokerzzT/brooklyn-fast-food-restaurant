import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- mocks ---

vi.mock("../services/dashboard.service", () => ({
	dashboardService: {
		getUser: vi.fn(),
	},
}));

vi.mock("@/src/shared/services/query-helpers", () => ({
	handleApiResponse: vi.fn((res: unknown) => res),
}));

// --- helpers ---

import { handleApiResponse } from "@/src/shared/services/query-helpers";

import { dashboardService } from "../services/dashboard.service";
import { useDashboardUser } from "./use-dashboard-user";

function createTestQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function wrapper({ children }: { children: ReactNode }) {
	const qc = createTestQueryClient();
	return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// --- tests ---

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useDashboardUser", () => {
	it("calls dashboardService.getUser and returns user", async () => {
		const mockUser = { id: 1, name: "Admin" };
		vi.mocked(dashboardService.getUser).mockResolvedValue({
			user: mockUser,
		} as never);
		vi.mocked(handleApiResponse).mockReturnValue({ user: mockUser });

		const { result } = renderHook(() => useDashboardUser(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(dashboardService.getUser).toHaveBeenCalledOnce();
		expect(result.current.data).toEqual(mockUser);
	});

	it("returns undefined data on error without crashing", async () => {
		vi.mocked(dashboardService.getUser).mockRejectedValue(
			new Error("unauthorized"),
		);

		const { result } = renderHook(() => useDashboardUser(), { wrapper });

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.data).toBeUndefined();
	});
});
