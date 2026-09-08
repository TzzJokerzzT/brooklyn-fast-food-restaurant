import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ── Product Form Types ──────────────────────────────────────

export interface ProductFormData {
	productName: string;
	productImage: File | null;
	isPromotion: boolean;
	price: number;
	ingredients: string[];
}

interface ProductFormState {
	/** Modo del formulario: single o bulk */
	mode: "single" | "bulk";
	/** Lista de productos en el formulario */
	items: ProductFormData[];
	/** Estado de envío */
	isSubmitting: boolean;
	/** Error global */
	error: string | null;

	// Actions
	setMode: (mode: "single" | "bulk") => void;
	addItem: () => void;
	removeItem: (index: number) => void;
	updateItem: (index: number, data: Partial<ProductFormData>) => void;
	resetForm: () => void;
	setSubmitting: (value: boolean) => void;
	setError: (message: string | null) => void;
}

const emptyProduct: ProductFormData = {
	productName: "",
	productImage: null,
	isPromotion: false,
	price: 0,
	ingredients: [],
};

// ── Product Store ───────────────────────────────────────────

export const useProductStore = create<ProductFormState>()(
	devtools(
		(set) => ({
			mode: "single",
			items: [{ ...emptyProduct }],
			isSubmitting: false,
			error: null,

			setMode: (mode) =>
				set(
					(state) => ({
						mode,
						// Al cambiar a single, mantener solo el primer item
						items:
							mode === "single"
								? [state.items[0] ?? { ...emptyProduct }]
								: state.items,
					}),
					false,
					"setMode",
				),

			addItem: () =>
				set(
					(state) => ({
						items: [...state.items, { ...emptyProduct }],
					}),
					false,
					"addItem",
				),

			removeItem: (index) =>
				set(
					(state) => ({
						items: state.items.filter((_, i) => i !== index),
					}),
					false,
					"removeItem",
				),

			updateItem: (index, data) =>
				set(
					(state) => ({
						items: state.items.map((item, i) =>
							i === index ? { ...item, ...data } : item,
						),
					}),
					false,
					"updateItem",
				),

			resetForm: () =>
				set(
					{ items: [{ ...emptyProduct }], error: null, mode: "single" },
					false,
					"resetForm",
				),

			setSubmitting: (value) =>
				set({ isSubmitting: value }, false, "setSubmitting"),

			setError: (message) => set({ error: message }, false, "setError"),
		}),
		{ name: "product-form-store" },
	),
);
