import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BasicChip from "./BasicChip";

vi.mock("@heroui/react", () => ({
	Chip: Object.assign(
		({ children, variant, size, className }: any) => (
			<div
				data-testid="chip"
				data-variant={variant}
				data-size={size}
				className={className}
			>
				{children}
			</div>
		),
		{
			Label: ({ children }: any) => <span>{children}</span>,
		},
	),
}));

describe("BasicChip", () => {
	it("renders children text", () => {
		render(<BasicChip>New</BasicChip>);
		expect(screen.getByText("New")).toBeInTheDocument();
	});

	it("renders as a div when no onClick", () => {
		const { container } = render(<BasicChip>Tag</BasicChip>);
		const tag = container.firstElementChild!;
		expect(tag.tagName).toBe("DIV");
	});

	it("renders as a button when onClick is provided", () => {
		const { container } = render(<BasicChip onClick={() => {}}>Tag</BasicChip>);
		const tag = container.firstElementChild!;
		expect(tag.tagName).toBe("BUTTON");
	});

	it("calls onClick when clicked", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<BasicChip onClick={onClick}>Clickable</BasicChip>);

		await user.click(screen.getByRole("button", { name: "Clickable" }));

		expect(onClick).toHaveBeenCalledOnce();
	});

	it("passes size to Chip", () => {
		render(<BasicChip size="lg">Large</BasicChip>);
		expect(screen.getByTestId("chip")).toHaveAttribute("data-size", "lg");
	});

	it("defaults size to md", () => {
		render(<BasicChip>Default</BasicChip>);
		expect(screen.getByTestId("chip")).toHaveAttribute("data-size", "md");
	});

	it("passes variant to Chip", () => {
		render(<BasicChip variant="primary">Styled</BasicChip>);
		expect(screen.getByTestId("chip")).toHaveAttribute(
			"data-variant",
			"primary",
		);
	});

	it("renders icon when provided", () => {
		render(
			<BasicChip icon={<span data-testid="icon">★</span>}>With Icon</BasicChip>,
		);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("button has type=button when onClick is provided", () => {
		const { container } = render(<BasicChip onClick={() => {}}>Tag</BasicChip>);
		const tag = container.firstElementChild!;
		expect(tag).toHaveAttribute("type", "button");
	});
});
