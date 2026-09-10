import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Footer from "./Footer";

vi.mock("next/link", () => ({
	default: ({ children, href, className, ...props }: any) => (
		<a href={href} className={className} {...props}>
			{children}
		</a>
	),
}));

describe("Footer", () => {
	it("renders brand name", () => {
		render(<Footer />);
		const brooklynMatches = screen.getAllByText(/BROOKLYN/);
		expect(brooklynMatches.length).toBeGreaterThanOrEqual(2);
	});

	it("renders all navigation links", () => {
		render(<Footer />);
		expect(screen.getByRole("link", { name: "LOCATIONS" })).toHaveAttribute(
			"href",
			"#",
		);
		expect(screen.getByRole("link", { name: "NUTRITION" })).toHaveAttribute(
			"href",
			"#",
		);
		expect(screen.getByRole("link", { name: "CAREERS" })).toHaveAttribute(
			"href",
			"#",
		);
		expect(screen.getByRole("link", { name: "PRIVACY" })).toHaveAttribute(
			"href",
			"#",
		);
	});

	it("renders four navigation links", () => {
		render(<Footer />);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(4);
	});

	it("renders copyright text", () => {
		render(<Footer />);
		expect(screen.getByText(/© 2024 BROOKLYN FAST FOOD/)).toBeInTheDocument();
		expect(screen.getByText(/RAW\. FAST\. AUTHENTIC\./)).toBeInTheDocument();
	});

	it("renders a footer element", () => {
		const { container } = render(<Footer />);
		expect(container.querySelector("footer")).toBeInTheDocument();
	});
});
