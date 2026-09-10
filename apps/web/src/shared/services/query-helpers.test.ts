import { describe, expect, it } from "vitest";
import type { ApiResponse } from "../types/services/api-response";
import { ApiQueryError, handleApiResponse } from "./query-helpers";

// ── handleApiResponse ────────────────────────────────────────

describe("handleApiResponse", () => {
	it("returns data when response is successful", () => {
		const response: ApiResponse<string> = {
			success: true,
			data: "hello",
		};
		expect(handleApiResponse(response)).toBe("hello");
	});

	it("returns complex data structures on success", () => {
		const response: ApiResponse<{ id: number; name: string }> = {
			success: true,
			data: { id: 1, name: "test" },
		};
		expect(handleApiResponse(response)).toEqual({ id: 1, name: "test" });
	});

	it("throws ApiQueryError when response is not successful", () => {
		const response: ApiResponse<null> = {
			success: false,
			data: null,
			message: "Unauthorized",
		};
		expect(() => handleApiResponse(response)).toThrow(ApiQueryError);
	});

	it("throws with the response message when provided", () => {
		const response: ApiResponse<null> = {
			success: false,
			data: null,
			message: "Invalid credentials",
		};
		expect(() => handleApiResponse(response)).toThrow("Invalid credentials");
	});

	it("throws default message when no message is provided", () => {
		const response: ApiResponse<null> = {
			success: false,
			data: null,
		};
		expect(() => handleApiResponse(response)).toThrow("Request failed");
	});
});

// ── ApiQueryError ────────────────────────────────────────────

describe("ApiQueryError", () => {
	it("has the correct name", () => {
		const error = new ApiQueryError("test");
		expect(error.name).toBe("ApiQueryError");
	});

	it("has the correct message", () => {
		const error = new ApiQueryError("something went wrong");
		expect(error.message).toBe("something went wrong");
	});

	it("stores statusCode when provided", () => {
		const error = new ApiQueryError("not found", 404);
		expect(error.statusCode).toBe(404);
	});

	it("has undefined statusCode when not provided", () => {
		const error = new ApiQueryError("fail");
		expect(error.statusCode).toBeUndefined();
	});

	it("is an instance of Error", () => {
		const error = new ApiQueryError("err");
		expect(error).toBeInstanceOf(Error);
	});
});
