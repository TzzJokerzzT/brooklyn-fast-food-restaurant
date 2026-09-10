import { beforeEach, describe, expect, it } from "vitest";
import { useProductStore } from "./product-store";

beforeEach(() => {
	useProductStore.setState({
		mode: "single",
		items: [
			{
				productName: "",
				productImage: null,
				isPromotion: false,
				price: 0,
				ingredients: [],
			},
		],
		isSubmitting: false,
		error: null,
	});
});

// ── Initial state ────────────────────────────────────────────

describe("product store initial state", () => {
	it("starts in single mode", () => {
		expect(useProductStore.getState().mode).toBe("single");
	});

	it("starts with one empty item", () => {
		const items = useProductStore.getState().items;
		expect(items).toHaveLength(1);
		expect(items[0]).toEqual({
			productName: "",
			productImage: null,
			isPromotion: false,
			price: 0,
			ingredients: [],
		});
	});

	it("is not submitting", () => {
		expect(useProductStore.getState().isSubmitting).toBe(false);
	});

	it("has no error", () => {
		expect(useProductStore.getState().error).toBeNull();
	});
});

// ── setMode ──────────────────────────────────────────────────

describe("setMode", () => {
	it("switches to bulk and keeps items", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().addItem();
		useProductStore.getState().setMode("bulk");

		const state = useProductStore.getState();
		expect(state.mode).toBe("bulk");
		expect(state.items).toHaveLength(3);
	});

	it("switches to single and trims to first item", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().addItem();
		useProductStore.getState().setMode("single");

		const state = useProductStore.getState();
		expect(state.mode).toBe("single");
		expect(state.items).toHaveLength(1);
	});

	it("switching to single from single preserves the item", () => {
		useProductStore.getState().updateItem(0, { productName: "Test" });
		useProductStore.getState().setMode("single");

		expect(useProductStore.getState().items[0].productName).toBe("Test");
	});
});

// ── addItem ──────────────────────────────────────────────────

describe("addItem", () => {
	it("adds a new empty product to items", () => {
		useProductStore.getState().addItem();

		const items = useProductStore.getState().items;
		expect(items).toHaveLength(2);
		expect(items[1]).toEqual({
			productName: "",
			productImage: null,
			isPromotion: false,
			price: 0,
			ingredients: [],
		});
	});

	it("adds multiple items sequentially", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().addItem();

		expect(useProductStore.getState().items).toHaveLength(3);
	});
});

// ── removeItem ───────────────────────────────────────────────

describe("removeItem", () => {
	it("removes item at given index", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().addItem();
		useProductStore.getState().removeItem(1);

		expect(useProductStore.getState().items).toHaveLength(2);
	});

	it("removes the first item", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().removeItem(0);

		const items = useProductStore.getState().items;
		expect(items).toHaveLength(1);
	});
});

// ── updateItem ───────────────────────────────────────────────

describe("updateItem", () => {
	it("merges partial data at the given index", () => {
		useProductStore.getState().updateItem(0, { productName: "Burger" });

		expect(useProductStore.getState().items[0].productName).toBe("Burger");
	});

	it("preserves other fields when updating one", () => {
		useProductStore.getState().updateItem(0, { price: 9.99 });

		const item = useProductStore.getState().items[0];
		expect(item.price).toBe(9.99);
		expect(item.productName).toBe("");
		expect(item.isPromotion).toBe(false);
	});

	it("does not affect other items", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().updateItem(0, { productName: "Changed" });

		expect(useProductStore.getState().items[1].productName).toBe("");
	});
});

// ── resetForm ────────────────────────────────────────────────

describe("resetForm", () => {
	it("resets items to a single empty product", () => {
		useProductStore.getState().addItem();
		useProductStore.getState().addItem();
		useProductStore.getState().resetForm();

		const state = useProductStore.getState();
		expect(state.items).toHaveLength(1);
		expect(state.items[0]).toEqual({
			productName: "",
			productImage: null,
			isPromotion: false,
			price: 0,
			ingredients: [],
		});
	});

	it("resets mode to single", () => {
		useProductStore.getState().setMode("bulk");
		useProductStore.getState().resetForm();

		expect(useProductStore.getState().mode).toBe("single");
	});

	it("clears error", () => {
		useProductStore.getState().setError("something went wrong");
		useProductStore.getState().resetForm();

		expect(useProductStore.getState().error).toBeNull();
	});
});

// ── setSubmitting / setError ─────────────────────────────────

describe("setSubmitting and setError", () => {
	it("setSubmitting toggles isSubmitting", () => {
		useProductStore.getState().setSubmitting(true);
		expect(useProductStore.getState().isSubmitting).toBe(true);

		useProductStore.getState().setSubmitting(false);
		expect(useProductStore.getState().isSubmitting).toBe(false);
	});

	it("setError sets the error message", () => {
		useProductStore.getState().setError("Network error");
		expect(useProductStore.getState().error).toBe("Network error");
	});

	it("setError clears error when passed null", () => {
		useProductStore.getState().setError("fail");
		useProductStore.getState().setError(null);
		expect(useProductStore.getState().error).toBeNull();
	});
});
