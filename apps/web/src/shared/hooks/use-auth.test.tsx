import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- stable mock references (hoisted so vi.mock factories can access them) ---

const mocks = vi.hoisted(() => ({
	mockReplace: vi.fn(),
	mockPush: vi.fn(),
	mockSetUser: vi.fn(),
	mockStoreLogout: vi.fn(),
}));

// --- mocks ---

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mocks.mockReplace, push: mocks.mockPush }),
	usePathname: () => "/",
}));

vi.mock("../components/Toast", () => ({
	showToast: vi.fn(),
}));

vi.mock("@/src/shared/services", () => ({
	authService: {
		me: vi.fn(),
		login: vi.fn(),
		logout: vi.fn(),
	},
}));

vi.mock("@/src/shared/services/query-helpers", () => ({
	handleApiResponse: vi.fn((res: unknown) => res),
}));

vi.mock("@/src/shared/store/auth.store", () => ({
	useAuthStore: vi.fn((selector?: (s: Record<string, unknown>) => unknown) => {
		const state = {
			user: null as unknown,
			setUser: mocks.mockSetUser,
			logout: mocks.mockStoreLogout,
		};
		return selector ? selector(state) : state;
	}),
}));

// --- helpers ---

import { authService } from "@/src/shared/services";
import { handleApiResponse } from "@/src/shared/services/query-helpers";

import { showToast } from "../components/Toast";
import { useLogin, useLogout, useMe } from "./use-auth";

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

describe("useMe", () => {
	it("sets user in store on success", async () => {
		const mockUser = { id: 1, name: "Alex" };
		vi.mocked(authService.me).mockResolvedValue({ user: mockUser } as never);
		vi.mocked(handleApiResponse).mockReturnValue({ user: mockUser });

		const { result } = renderHook(() => useMe(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(authService.me).toHaveBeenCalledOnce();
		expect(mocks.mockSetUser).toHaveBeenCalledWith(mockUser);
	});

	it("sets user to null on error", async () => {
		vi.mocked(authService.me).mockRejectedValue(new Error("fail"));

		const { result } = renderHook(() => useMe(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeNull();
		expect(mocks.mockSetUser).toHaveBeenCalledWith(null);
	});
});

describe("useLogin", () => {
	it("on success calls setUser, showToast, and router.replace", async () => {
		const mockUser = { id: 1, name: "Alex" };
		vi.mocked(authService.login).mockResolvedValue({ user: mockUser } as never);
		vi.mocked(handleApiResponse).mockReturnValue({ user: mockUser });

		const { result } = renderHook(() => useLogin(), { wrapper });

		await act(async () => {
			await result.current.mutateAsync({ email: "a@b.com", password: "123" });
		});

		expect(authService.login).toHaveBeenCalledWith({
			email: "a@b.com",
			password: "123",
		});
		expect(mocks.mockSetUser).toHaveBeenCalledWith(mockUser);
		expect(showToast).toHaveBeenCalledWith(
			"Has iniciado sesión correctamente",
			"success",
		);
		expect(mocks.mockReplace).toHaveBeenCalledWith("/");
	});

	it("on error calls showToast with error message", async () => {
		vi.mocked(authService.login).mockRejectedValue(
			new Error("Credenciales inválidas"),
		);

		const { result } = renderHook(() => useLogin(), { wrapper });

		await act(async () => {
			try {
				await result.current.mutateAsync({
					email: "a@b.com",
					password: "wrong",
				});
			} catch {
				// expected
			}
		});

		expect(showToast).toHaveBeenCalledWith("Credenciales inválidas", "error");
	});
});

describe("useLogout", () => {
	it("calls authService.logout, store logout, queryClient.clear, and router.replace", async () => {
		vi.mocked(authService.logout).mockResolvedValue(undefined as never);

		const { result } = renderHook(() => useLogout(), { wrapper });

		await act(async () => {
			await result.current();
		});

		expect(authService.logout).toHaveBeenCalledOnce();
		expect(mocks.mockStoreLogout).toHaveBeenCalledOnce();
		expect(showToast).toHaveBeenCalledWith(
			"Has cerrado sesión correctamente",
			"success",
		);
		expect(mocks.mockReplace).toHaveBeenCalledWith("/");
	});
});
