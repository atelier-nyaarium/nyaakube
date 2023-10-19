import json5 from "json5";

/**
 * Get environment variable and parse it if applicable.
 *
 * If ends in ".json5", it will be parsed as JSON5.
 *
 * @param {string} variableName - Name of the environment variable. Case sensitive.
 *
 * @returns {any} - The parsed environment variable.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * const config = getEnv("CONFIG");
 * -> "Test value"
 *
 * @example
 * const config = getEnv("config.json5");
 * -> { foo: "Test value" }
 */
export function getEnv(variableName) {
	if (typeof variableName !== "string") {
		throw new TypeError(
			`getEnv(variableName) : 'variableName' must be a string.`,
		);
	}

	if (!(variableName in process.env)) {
		console.log(`⚠️ `, `Missing ${variableName} environment variable`);
		return null;
	}

	let parsedConfig = process.env[String(variableName)];

	if (!(typeof parsedConfig === "string")) {
		console.log(`⚠️ `, `Variable ${variableName} is not a string`);
		return null;
	}

	parsedConfig = parsedConfig.trim();

	if (!parsedConfig) {
		console.log(`⚠️ `, `Variable ${variableName} is empty`);
		return null;
	}

	try {
		// Ends in .json5
		if (variableName.slice(-6) === ".json5") {
			const ch = parsedConfig[0];
			if (ch !== "{" && ch !== "[" && ch !== '"') {
				parsedConfig = Buffer.from(parsedConfig, "base64").toString(
					"utf8",
				);
			}

			parsedConfig = structuredClone(json5.parse(parsedConfig));
		}
	} catch (error) {
		console.log(`⚠️ `, `Failed to parse ${variableName}`);
		return null;
	}

	return parsedConfig;
}
