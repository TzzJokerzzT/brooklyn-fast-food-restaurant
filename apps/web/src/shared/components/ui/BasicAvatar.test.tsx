import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BasicAvatar from "./BasicAvatar";

vi.mock("@heroui/react", () => ({
	Avatar: Object.assign(
		({ children, variant, size, className }: any) => (
			<div
				data-testid="avatar"
				data-variant={variant}
				data-size={size}
				className={className}
			>
				{children}
			</div>
		),
		{
			Image: ({ src, alt }: any) => (
				<img data-testid="avatar-image" src={src} alt={alt} />
			),
			Fallback: ({ children }: any) => (
				<span data-testid="avatar-fallback">{children}</span>
			),
		},
	),
}));

describe("BasicAvatar", () => {
	it("renders fallback text when not isImage", () => {
		render(<BasicAvatar>JD</BasicAvatar>);
		expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("JD");
	});

	it("renders image when isImage is true", () => {
		render(<BasicAvatar isImage src="/photo.jpg" alt="Profile" />);
		expect(screen.getByTestId("avatar-image")).toHaveAttribute(
			"src",
			"/photo.jpg",
		);
		expect(screen.getByTestId("avatar-image")).toHaveAttribute(
			"alt",
			"Profile",
		);
	});

	it("does not render fallback when isImage is true", () => {
		render(<BasicAvatar isImage src="/photo.jpg" alt="Profile" />);
		expect(screen.queryByTestId("avatar-fallback")).not.toBeInTheDocument();
	});

	it("passes size to Avatar", () => {
		render(<BasicAvatar size="lg">AB</BasicAvatar>);
		expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "lg");
	});

	it("defaults size to md", () => {
		render(<BasicAvatar>AB</BasicAvatar>);
		expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "md");
	});

	it("passes variant to Avatar", () => {
		render(<BasicAvatar variant="default">AB</BasicAvatar>);
		expect(screen.getByTestId("avatar")).toHaveAttribute(
			"data-variant",
			"default",
		);
	});

	it("defaults variant to soft", () => {
		render(<BasicAvatar>AB</BasicAvatar>);
		expect(screen.getByTestId("avatar")).toHaveAttribute(
			"data-variant",
			"soft",
		);
	});

	it("passes className to Avatar", () => {
		render(<BasicAvatar className="custom-class">AB</BasicAvatar>);
		expect(screen.getByTestId("avatar")).toHaveAttribute(
			"class",
			"custom-class",
		);
	});
});
