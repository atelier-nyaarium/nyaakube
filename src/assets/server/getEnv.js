import json5 from "json5";

/**
 * Returns the value of the specified environment variable after parsing it.
 *
 * @param {string} variableName - The name of the environment variable to retrieve.
 *
 * @returns {*} The parsed value of the environment variable, or null if it is not defined or cannot be parsed.
 */
export default function getEnv(variableName) {
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

			parsedConfig = json5.parse(parsedConfig);
		}
	} catch (error) {
		console.log(`⚠️ `, `Failed to parse ${variableName}`);
		return null;
	}

	return parsedConfig;
}
