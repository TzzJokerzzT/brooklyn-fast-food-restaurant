import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore, useCartStore } from "../src/shared/store";

// Reset stores before each test
beforeEach(() => {
  useUIStore.setState({ isMenuOpen: false, isDarkMode: true });
  useCartStore.setState({ items: [] });
});

describe("UI Store", () => {
  it("toggles menu", () => {
    expect(useUIStore.getState().isMenuOpen).toBe(false);
    useUIStore.getState().toggleMenu();
    expect(useUIStore.getState().isMenuOpen).toBe(true);
    useUIStore.getState().toggleMenu();
    expect(useUIStore.getState().isMenuOpen).toBe(false);
  });

  it("toggles dark mode", () => {
    expect(useUIStore.getState().isDarkMode).toBe(true);
    useUIStore.getState().toggleDarkMode();
    expect(useUIStore.getState().isDarkMode).toBe(false);
  });
});

describe("Cart Store", () => {
  it("adds item to cart", () => {
    useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("increases quantity when adding same item", () => {
    useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
    useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("removes item from cart", () => {
    useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
    useCartStore.getState().removeItem("1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates total", () => {
    useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
    useCartStore.getState().addItem({ id: "2", name: "Fries", price: 5 });
    expect(useCartStore.getState().total()).toBe(17);
  });

  it("clears cart", () => {
    useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
