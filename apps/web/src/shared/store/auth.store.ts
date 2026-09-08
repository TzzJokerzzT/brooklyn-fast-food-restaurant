import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { UserResponse } from "../services/types";

// ── Auth Store ──────────────────────────────────────────────
// Manages authentication state and user data.
// Persists to sessionStorage (clears on tab close).

// Zustand persist storage adapter for sessionStorage
// Uses createJSONStorage to handle serialization automatically
const sessionStorageAdapter = createJSONStorage<AuthStore>(() => ({
	getItem: (name: string): string | null => {
		if (typeof window === "undefined") return null;
		return sessionStorage.getItem(name);
	},
	setItem: (name: string, value: string): void => {
		if (typeof window === "undefined") return;
		sessionStorage.setItem(name, value);
	},
	removeItem: (name: string): void => {
		if (typeof window === "undefined") return;
		sessionStorage.removeItem(name);
	},
}));

export interface AuthStore {
	// State
	isAuthenticated: boolean;
	user: UserResponse | null;

	// Actions
	setAuthenticated: (value: boolean) => void;
	setUser: (user: UserResponse | null) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			(set) => ({
				isAuthenticated: false,
				user: null,

				setAuthenticated: (value) => set({ isAuthenticated: value }),

				setUser: (user) =>
					set({
						user,
						isAuthenticated: user !== null,
					}),

				logout: () =>
					set({
						isAuthenticated: false,
						user: null,
					}),
			}),
			{
				name: "brooklyn_auth",
				storage: sessionStorageAdapter,
			},
		),
	),
);
