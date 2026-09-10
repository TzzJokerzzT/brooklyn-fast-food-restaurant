import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BasicSpinner from "./BasicSpinner";

vi.mock("@heroui/react", () => ({
	Spinner: ({ size, className }: any) => (
		<span data-testid="heroui-spinner" data-size={size} className={className} />
	),
}));

describe("BasicSpinner", () => {
	it("renders the HeroUI Spinner", () => {
		render(<BasicSpinner />);
		expect(screen.getByTestId("heroui-spinner")).toBeInTheDocument();
	});

	it("defaults size to md", () => {
		render(<BasicSpinner />);
		expect(screen.getByTestId("heroui-spinner")).toHaveAttribute(
			"data-size",
			"md",
		);
	});

	it("passes custom size", () => {
		render(<BasicSpinner size="lg" />);
		expect(screen.getByTestId("heroui-spinner")).toHaveAttribute(
			"data-size",
			"lg",
		);
	});

	it("defaults className to text-mustard", () => {
		render(<BasicSpinner />);
		expect(screen.getByTestId("heroui-spinner")).toHaveAttribute(
			"class",
			"text-mustard",
		);
	});

	it("overrides className when provided", () => {
		render(<BasicSpinner className="text-red-500" />);
		expect(screen.getByTestId("heroui-spinner")).toHaveAttribute(
			"class",
			"text-red-500",
		);
	});

	it("renders children alongside spinner", () => {
		render(<BasicSpinner>Loading data...</BasicSpinner>);
		expect(screen.getByText("Loading data...")).toBeInTheDocument();
		expect(screen.getByTestId("heroui-spinner")).toBeInTheDocument();
	});
});
