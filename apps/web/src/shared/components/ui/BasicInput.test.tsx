import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BasicInput from "./BasicInput";

vi.mock("@heroui/react", () => ({
	TextField: ({ children, name, isRequired, className }: any) => (
		<div
			data-testid="text-field"
			data-name={name}
			data-required={isRequired}
			className={className}
		>
			{children}
		</div>
	),
	Input: ({
		placeholder,
		disabled,
		onChange,
		minLength,
		maxLength,
		variant,
		...props
	}: any) => (
		<input
			placeholder={placeholder}
			disabled={disabled}
			onChange={onChange}
			minLength={minLength}
			maxLength={maxLength}
			data-variant={variant}
			{...props}
		/>
	),
	Label: ({ children }: any) => <label>{children}</label>,
	FieldError: () => <span data-testid="field-error" />,
}));

describe("BasicInput", () => {
	const baseProps = {
		labelText: "Email",
		placeholderText: "Enter email",
		name: "email",
	};

	it("renders label text", () => {
		render(<BasicInput {...baseProps} />);
		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("renders placeholder text", () => {
		render(<BasicInput {...baseProps} />);
		expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
	});

	it("passes name to TextField", () => {
		render(<BasicInput {...baseProps} />);
		expect(screen.getByTestId("text-field")).toHaveAttribute(
			"data-name",
			"email",
		);
	});

	it("defaults isRequired to true", () => {
		render(<BasicInput {...baseProps} />);
		expect(screen.getByTestId("text-field")).toHaveAttribute(
			"data-required",
			"true",
		);
	});

	it("passes isRequired as false when set", () => {
		render(<BasicInput {...baseProps} isRequired={false} />);
		expect(screen.getByTestId("text-field")).toHaveAttribute(
			"data-required",
			"false",
		);
	});

	it("renders disabled input when disabled is true", () => {
		render(<BasicInput {...baseProps} disabled />);
		expect(screen.getByPlaceholderText("Enter email")).toBeDisabled();
	});

	it("renders enabled input by default", () => {
		render(<BasicInput {...baseProps} />);
		expect(screen.getByPlaceholderText("Enter email")).not.toBeDisabled();
	});

	it("passes type to TextField", () => {
		render(<BasicInput {...baseProps} type="password" />);
		expect(screen.getByTestId("text-field")).toHaveAttribute(
			"data-name",
			"email",
		);
	});

	it("passes variant to input", () => {
		render(<BasicInput {...baseProps} variant="secondary" />);
		expect(screen.getByPlaceholderText("Enter email")).toHaveAttribute(
			"data-variant",
			"secondary",
		);
	});

	it("passes minLength and maxLength", () => {
		render(<BasicInput {...baseProps} minLength={5} maxLength={50} />);
		const input = screen.getByPlaceholderText("Enter email");
		expect(input).toHaveAttribute("minlength", "5");
		expect(input).toHaveAttribute("maxlength", "50");
	});
});
