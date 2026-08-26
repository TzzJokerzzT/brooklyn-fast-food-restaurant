#!/usr/bin/env node
/**
 * List all available HeroUI v3 components.
 *
 * Usage:
 *   node list_components.mjs
 *
 * Output:
 *   JSON with components array, latestVersion, and count
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const APP_PARAM = "app=react-skills";
const LLMS_TXT_URL = "https://heroui.com/react/llms.txt";

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
 * Fetch component list from llms.txt fallback URL.
 */
async function fetchFallback() {
	try {
		const response = await fetch(LLMS_TXT_URL, {
			headers: { "User-Agent": "HeroUI-Skill/1.0" },
			signal: AbortSignal.timeout(30000),
		});

		if (!response.ok) {
			return null;
		}

		const content = await response.text();

		// Parse markdown to extract component names from pattern: - [ComponentName](url)
		// Look for links under the Components section (### Components)
		const components = [];
		let inComponentsSection = false;

		for (const line of content.split("\n")) {
			// Check if we're entering the Components section (uses ### header)
			if (line.trim() === "### Components") {
				inComponentsSection = true;
				continue;
			}

			// Check if we're leaving the Components section (another ### header)
			if (inComponentsSection && line.trim().startsWith("### ")) {
				break;
			}

			// Extract component name from markdown link pattern
			// Match: - [ComponentName](https://www.heroui.com/docs/react/components/component-name)
			// Skip "All Components" which links to /components without a specific component
			if (inComponentsSection) {
				const match = line.match(
					/^\s*-\s*\[([^\]]+)\]\(https:\/\/www\.heroui\.com\/docs\/react\/components\/[a-z]/,
				);

				if (match) {
					components.push(match[1]);
				}
			}
		}

		if (components.length > 0) {
			return {
				components: components.sort(),
				count: components.length,
				latestVersion: "unknown",
			};
		}

		return null;
	} catch (_error) {
		return null;
	}
}

/**
 * Main function to list all available HeroUI v3 components.
 */
async function main() {
	let data = await fetchApi("/v1/components");

	// Check if API returned valid data with components
	if (!data?.components || data.components.length === 0) {
		data = await fetchFallback();
	}

	if (!data?.components || data.components.length === 0) {
		process.exit(1);
	}
}

main();
