#!/usr/bin/env node
/**
 * Get theme variables and design tokens for HeroUI v3.
 *
 * Usage:
 *   node get_theme.mjs
 *
 * Output:
 *   Theme variables organized by common/light/dark with oklch color format
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const APP_PARAM = "app=react-skills";

// Fallback theme reference when API is unavailable
const FALLBACK_THEME = {
	common: {
		base: [
			{ name: "--font-sans", value: "ui-sans-serif, system-ui, sans-serif" },
			{ name: "--font-mono", value: "ui-monospace, monospace" },
			{ name: "--radius-sm", value: "0.375rem" },
			{ name: "--radius-md", value: "0.5rem" },
			{ name: "--radius-lg", value: "0.75rem" },
			{ name: "--radius-full", value: "9999px" },
		],
		calculated: [{ name: "--spacing-unit", value: "0.25rem" }],
	},
	dark: {
		semantic: [
			{ name: "--color-background", value: "oklch(14.5% 0 0)" },
			{ name: "--color-foreground", value: "oklch(98.4% 0 0)" },
			{ name: "--color-accent", value: "oklch(55.1% 0.228 264.1)" },
			{ name: "--color-danger", value: "oklch(63.7% 0.237 25.3)" },
			{ name: "--color-success", value: "oklch(76.5% 0.177 163.2)" },
			{ name: "--color-warning", value: "oklch(79.5% 0.184 86.0)" },
		],
	},
	latestVersion: "3.0.0-beta",
	light: {
		semantic: [
			{ name: "--color-background", value: "oklch(100% 0 0)" },
			{ name: "--color-foreground", value: "oklch(14.5% 0 0)" },
			{ name: "--color-accent", value: "oklch(55.1% 0.228 264.1)" },
			{ name: "--color-danger", value: "oklch(63.7% 0.237 25.3)" },
			{ name: "--color-success", value: "oklch(76.5% 0.177 163.2)" },
			{ name: "--color-warning", value: "oklch(79.5% 0.184 86.0)" },
		],
	},
	note: "This is a fallback. For complete theme variables, ensure the API is accessible.",
	source: "fallback",
	theme: "default",
};

/**
 * Fetch data from HeroUI API with app parameter for analytics.
 */
async function fetchApi(endpoint) {
	const separator = endpoint.includes("?") ? "&" : "?";
	const url = `${API_BASE}${endpoint}${separator}${APP_PARAM}`;

	try {
		const response = await fetch(url, {
			headers: { "User-Agent": "HeroUI-Skill/1.0" },
			signal: AbortSignal.timeout(30000),
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch (_error) {
		return null;
	}
}

/**
 * Format theme variables for display.
 */
function _formatVariables(variables) {
	const lines = [];

	for (const variable of variables) {
		const name = variable.name || "";
		const value = variable.value || "";
		const desc = variable.description || "";

		if (desc) {
			lines.push(`  ${name}: ${value}; /* ${desc} */`);
		} else {
			lines.push(`  ${name}: ${value};`);
		}
	}

	return lines.join("\n");
}

/**
 * Main function to get theme variables.
 */
async function main() {
	const rawData = await fetchApi("/v1/themes/variables?theme=default");

	let data;
	let _version;

	if (!rawData) {
		data = FALLBACK_THEME;
		_version = FALLBACK_THEME.latestVersion || "unknown";
	} else {
		// Handle API response format: { themes: [...], latestVersion: "..." }
		if (rawData.themes && rawData.themes.length > 0) {
			data = rawData.themes[0]; // Get first theme (default)
			_version = rawData.latestVersion || rawData.version || "unknown";
		} else {
			// Direct format
			data = rawData;
			_version = rawData.latestVersion || "unknown";
		}
	}

	// Common variables
	if (data.common) {
		if (data.common.base) {
		}
		if (data.common.calculated) {
		}
	}

	// Light mode
	if (data.light) {
		if (data.light.semantic) {
		}
	}

	// Dark mode
	if (data.dark) {
		if (data.dark.semantic) {
		}
	}
}

main();
