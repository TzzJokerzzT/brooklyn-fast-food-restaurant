import { useCallback, useState } from "react";
import type { LandingState } from "../types";

const initialState: LandingState = {
	isLoading: false,
	error: null,
};

export function useLanding() {
	const [state, setState] = useState<LandingState>(initialState);

	const reset = useCallback(() => {
		setState(initialState);
	}, []);

	return { ...state, reset };
}
