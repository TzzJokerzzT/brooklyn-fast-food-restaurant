import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Simple component to test
function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-accent text-white px-4 py-2">
      {children}
    </button>
  );
}

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    let clicked = false;
    render(<Button onClick={() => (clicked = true)}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(clicked).toBe(true);
  });

  it("has correct styles", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("bg-accent");
  });
});
