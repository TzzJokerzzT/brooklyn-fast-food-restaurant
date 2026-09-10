import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Spinner from "./Spinner";

describe("Spinner", () => {
	it("renders the spinning div", () => {
		const { container } = render(<Spinner />);
		const spinner = container.querySelector(".animate-spin");
		expect(spinner).toBeInTheDocument();
	});

	it("applies default classes to the wrapper", () => {
		const { container } = render(<Spinner />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain("flex");
		expect(wrapper.className).toContain("flex-col");
		expect(wrapper.className).toContain("items-center");
		expect(wrapper.className).toContain("justify-center");
		expect(wrapper.className).toContain("gap-3");
	});

	it("applies empty className by default", () => {
		const { container } = render(<Spinner />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toBe(
			"flex flex-col items-center justify-center gap-3 ",
		);
	});

	it("appends custom className", () => {
		const { container } = render(<Spinner className="my-custom" />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain("my-custom");
	});

	it("renders children below the spinner", () => {
		render(<Spinner>Please wait</Spinner>);
		expect(screen.getByText("Please wait")).toBeInTheDocument();
	});

	it("does not render children when none provided", () => {
		const { container } = render(<Spinner />);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.childElementCount).toBe(1);
	});
});
