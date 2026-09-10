import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- mocks ---

vi.mock("@/src/shared/services", () => ({
	usersService: {
		getAll: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		updateRole: vi.fn(),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/src/shared/services/query-helpers", () => ({
	handleApiResponse: vi.fn((res: unknown) => res),
}));

// --- helpers ---

import { usersService } from "@/src/shared/services";
import { handleApiResponse } from "@/src/shared/services/query-helpers";

import {
	useCreateUser,
	useDeleteUser,
	useUpdateUser,
	useUser,
	useUsers,
} from "./use-users";

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

describe("useUsers", () => {
	it("calls getAll and returns data", async () => {
		const mockData = { users: [{ id: 1, name: "Alex" }] };
		vi.mocked(usersService.getAll).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useUsers(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(usersService.getAll).toHaveBeenCalledOnce();
		expect(result.current.data).toEqual(mockData);
	});
});

describe("useUser", () => {
	it("calls getById when id > 0", async () => {
		const mockUser = { user: { id: 1, name: "Alex" } };
		vi.mocked(usersService.getById).mockResolvedValue(mockUser as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockUser);

		const { result } = renderHook(() => useUser(1), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(usersService.getById).toHaveBeenCalledWith(1);
		expect(result.current.data).toEqual(mockUser.user);
	});

	it("does not call getById when id <= 0", () => {
		vi.mocked(usersService.getById).mockResolvedValue({ user: null } as never);

		const { result } = renderHook(() => useUser(0), { wrapper });

		expect(result.current.isPending).toBe(true);
		expect(usersService.getById).not.toHaveBeenCalled();
	});
});

describe("useCreateUser", () => {
	it("calls create and invalidates users list", async () => {
		const mockData = { user: { id: 2, name: "New User" } };
		vi.mocked(usersService.create).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useCreateUser(), { wrapper });

		await act(async () => {
			await result.current.mutateAsync({
				userName: "New",
				lastName: "User",
				email: "n@u.com",
				password: "pass",
				roleId: 1,
				address: "123 St",
			});
		});

		expect(usersService.create).toHaveBeenCalledWith({
			userName: "New",
			lastName: "User",
			email: "n@u.com",
			password: "pass",
			roleId: 1,
			address: "123 St",
		});
	});
});

describe("useUpdateUser", () => {
	it("calls update with correct params", async () => {
		const mockData = { user: { id: 1 } };
		vi.mocked(usersService.update).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useUpdateUser(), { wrapper });

		await act(async () => {
			await result.current.mutateAsync({ id: 1, dto: { userName: "Updated" } });
		});

		expect(usersService.update).toHaveBeenCalledWith(1, {
			userName: "Updated",
		});
	});
});

describe("useDeleteUser", () => {
	it("calls delete and removes query data", async () => {
		const mockData = { message: "deleted" };
		vi.mocked(usersService.delete).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useDeleteUser(), { wrapper });

		await act(async () => {
			await result.current.mutateAsync(1);
		});

		expect(usersService.delete).toHaveBeenCalledWith(1);
	});
});
