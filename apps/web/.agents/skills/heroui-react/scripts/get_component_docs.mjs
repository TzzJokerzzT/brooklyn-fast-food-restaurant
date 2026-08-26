#!/usr/bin/env node
/**
 * Get complete component documentation (MDX) for HeroUI v3 components.
 *
 * Usage:
 *   node get_component_docs.mjs Button
 *   node get_component_docs.mjs Button Card TextField
 *
 * Output:
 *   MDX documentation including imports, usage, variants, props, examples
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const FALLBACK_BASE = "https://heroui.com";
const APP_PARAM = "app=react-skills";

/**
 * Convert PascalCase to kebab-case.
 */
function toKebabCase(name) {
	return name
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();
}

/**
 * Fetch data from HeroUI API with app parameter for analytics.
 */
async function fetchApi(endpoint, method = "GET", body = null) {
	const separator = endpoint.includes("?") ? "&" : "?";
	const url = `${API_BASE}${endpoint}${separator}${APP_PARAM}`;

	try {
		const options = {
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "HeroUI-Skill/1.0",
			},
			method,
			signal: AbortSignal.timeout(30000),
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch {
		return null;
	}
}

/**
 * Fetch MDX directly from v3.heroui.com as fallback.
 */
async function fetchFallback(component) {
	const kebabName = toKebabCase(component);
	const url = `${FALLBACK_BASE}/docs/react/components/${kebabName}.mdx`;

	try {
		const response = await fetch(url, {
			headers: { "User-Agent": "HeroUI-Skill/1.0" },
			signal: AbortSignal.timeout(30000),
		});

		if (!response.ok) {
			return { component, error: `Failed to fetch docs for ${component}` };
		}

		const content = await response.text();

		return {
			component,
			content,
			contentType: "mdx",
			source: "fallback",
			url,
		};
	} catch {
		return { component, error: `Failed to fetch docs for ${component}` };
	}
}

/**
 * Main function to get component documentation.
 */
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		process.exit(1);
	}

	const components = args;
	const data = await fetchApi("/v1/components/docs", "POST", { components });

	if (data?.results) {
		// Output results
		if (data.results.length === 1) {
			// Single component - output content directly for easier reading
			const result = data.results[0];

			if (result.content) {
			} else if (result.error) {
			} else {
			}
		} else {
		}

		return;
	}
	const results = [];

	for (const component of components) {
		const result = await fetchFallback(component);

		results.push(result);
	}

	// Output results
	if (results.length === 1) {
		// Single component - output content directly for easier reading
		const result = results[0];

		if (result.content) {
		} else {
		}
	} else {
	}
}

main();
