import { handleApiResponse } from "@/src/shared/services/query-helpers";
import type { UserResponse } from "@/src/shared/types/services/user";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

// ── Query Keys ──────────────────────────────────────────────

export const dashboardKeys = {
	all: ["dashboard"] as const,
	user: () => [...dashboardKeys.all, "user"] as const,
};

// ── Use Dashboard User ──────────────────────────────────────
// Obtiene la información del usuario logueado para el dashboard.

export function useDashboardUser() {
	return useQuery({
		queryKey: dashboardKeys.user(),
		queryFn: async (): Promise<UserResponse> => {
			const res = await dashboardService.getUser();
			return handleApiResponse(res).user;
		},
	});
}
