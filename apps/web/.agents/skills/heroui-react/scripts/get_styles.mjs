#!/usr/bin/env node
/**
 * Get CSS styles (BEM classes) for HeroUI v3 components.
 *
 * Usage:
 *   node get_styles.mjs Button
 *   node get_styles.mjs Button Card Chip
 *
 * Output:
 *   CSS file content with BEM classes and GitHub URL for each component
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const GITHUB_RAW_BASE =
	"https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3";
const APP_PARAM = "app=react-skills";

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
	} catch (_error) {
		return null;
	}
}

/**
 * Fetch CSS styles directly from GitHub as fallback.
 */
async function fetchGithubFallback(component) {
	// Try common patterns for style paths
	const patterns = [
		`packages/styles/src/components/${component.toLowerCase()}.css`,
		`packages/styles/components/${component.toLowerCase()}.css`,
	];

	for (const path of patterns) {
		const url = `${GITHUB_RAW_BASE}/${path}`;

		try {
			const response = await fetch(url, {
				headers: { "User-Agent": "HeroUI-Skill/1.0" },
				signal: AbortSignal.timeout(30000),
			});

			if (response.ok) {
				const content = await response.text();

				return {
					component,
					filePath: path,
					githubUrl: `https://github.com/heroui-inc/heroui/blob/v3/${path}`,
					source: "fallback",
					stylesCode: content,
				};
			}
		} catch {}
	}

	return { component, error: `Failed to fetch styles for ${component}` };
}

/**
 * Main function to get CSS styles for specified components.
 */
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		process.exit(1);
	}

	const components = args;
	const data = await fetchApi("/v1/components/styles", "POST", { components });

	if (data?.results) {
		for (const result of data.results) {
			result.source = "api";
		}

		// Output results
		if (data.results.length === 1) {
			const result = data.results[0];

			if (result.stylesCode) {
			} else {
			}
		} else {
		}

		return;
	}
	const results = [];

	for (const component of components) {
		const result = await fetchGithubFallback(component);

		results.push(result);
	}

	if (results.length === 1) {
		const result = results[0];

		if (result.stylesCode) {
		} else {
		}
	} else {
	}
}

main();
