#!/usr/bin/env node
/**
 * Get non-component HeroUI documentation (guides, theming, releases).
 *
 * Usage:
 *   node get_docs.mjs /docs/react/getting-started/theming
 *   node get_docs.mjs /docs/react/releases/v3-0-0-beta-3
 *
 * Output:
 *   MDX documentation content
 *
 * Note: For component docs, use get_component_docs.mjs instead.
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const FALLBACK_BASE = "https://heroui.com";
const APP_PARAM = "app=react-skills";

/**
 * Fetch documentation from HeroUI API.
 * Uses v1 endpoint pattern: /v1/docs/:path
 */
async function fetchApi(path) {
	// The v1 API expects path without /docs/ prefix
	// Input: /docs/react/getting-started/theming
	// API expects: react/getting-started/theming (route is /v1/docs/:path(*))
	const apiPath = path.startsWith("/docs/")
		? path.slice(6) // Remove /docs/ prefix
		: path.startsWith("/")
			? path.slice(1) // Remove leading /
			: path;

	const separator = "?";
	const url = `${API_BASE}/v1/docs/${apiPath}${separator}${APP_PARAM}`;

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
 * Fetch MDX directly from v3.heroui.com as fallback.
 */
async function fetchFallback(path) {
	// Ensure path starts with /docs and ends with .mdx
	let cleanPath = path.replace(/^\//, "");

	if (!cleanPath.endsWith(".mdx")) {
		cleanPath = `${cleanPath}.mdx`;
	}

	const url = `${FALLBACK_BASE}/${cleanPath}`;

	try {
		const response = await fetch(url, {
			headers: { "User-Agent": "HeroUI-Skill/1.0" },
			signal: AbortSignal.timeout(30000),
		});

		if (!response.ok) {
			return { error: `HTTP ${response.status}: ${response.statusText}`, path };
		}

		const content = await response.text();

		return {
			content,
			contentType: "mdx",
			path,
			source: "fallback",
			url,
		};
	} catch (error) {
		return { error: `Fetch Error: ${error.message}`, path };
	}
}

/**
 * Main function to get documentation for specified path.
 */
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		process.exit(1);
	}

	const path = args[0];

	// Check if user is trying to get component docs
	if (path.includes("/components/")) {
		const componentName = path.split("/").pop().replace(".mdx", "");
		const _titleCase =
			componentName.charAt(0).toUpperCase() + componentName.slice(1);
	}

	// Try API first
	const data = await fetchApi(path);

	if (data?.content) {
		data.source = "api";

		return;
	}
	const fallbackData = await fetchFallback(path);

	if (fallbackData.content) {
	} else {
		process.exit(1);
	}
}

main();
