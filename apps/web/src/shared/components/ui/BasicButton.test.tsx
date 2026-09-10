import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BasicButton from "./BasicButton";

vi.mock("@heroui/react", () => ({
	Button: ({
		children,
		onPress,
		type,
		isDisabled,
		isPending,
		className,
		...props
	}: any) => (
		<button
			type={type}
			onClick={onPress}
			disabled={isDisabled}
			className={className}
			data-pending={isPending}
			{...props}
		>
			{isPending ? <span data-testid="spinner" /> : null}
			{children}
		</button>
	),
	Spinner: ({ size, className }: any) => (
		<span data-testid="heroui-spinner" data-size={size} className={className} />
	),
}));

describe("BasicButton", () => {
	it("renders children", () => {
		render(<BasicButton>Click me</BasicButton>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("calls onPress when clicked", async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();
		render(<BasicButton onPress={onPress}>Submit</BasicButton>);

		await user.click(screen.getByRole("button", { name: "Submit" }));

		expect(onPress).toHaveBeenCalledOnce();
	});

	it("shows spinner when isPending", () => {
		render(<BasicButton isPending>Loading</BasicButton>);
		expect(screen.getByTestId("spinner")).toBeInTheDocument();
	});

	it("disables the button when isDisabled", () => {
		render(<BasicButton isDisabled>Disabled</BasicButton>);
		expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
	});

	it("defaults to type button", () => {
		render(<BasicButton>Default</BasicButton>);
		expect(screen.getByRole("button")).toHaveAttribute("type", "button");
	});

	it("passes through type prop", () => {
		render(<BasicButton type="submit">Submit</BasicButton>);
		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});

	it("passes through className", () => {
		render(<BasicButton className="my-class">Styled</BasicButton>);
		expect(screen.getByRole("button")).toHaveClass("my-class");
	});
});
