import json5 from "json5";

/**
 * Get environment variable and parse it if applicable.
 * If ends in ".json5", it will be parsed as JSON5.
 *
 * @param variableName - Name of the environment variable. Case sensitive.
 * @returns The parsed environment variable, or null if not found or on parsing errors.
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
export function getEnv<T = any>(variableName: string): T | null {
	if (typeof variableName !== "string") {
		throw new TypeError(
			`getEnv(variableName) : 'variableName' must be a string.`,
		);
	}

	const envValue = process.env[variableName];
	if (typeof envValue !== "string") {
		console.log(
			`⚠️ `,
			`Missing or invalid type for ${variableName} environment variable`,
		);
		return null;
	}

	let parsedConfig = envValue.trim();
	if (!parsedConfig) {
		console.log(`⚠️ `, `Variable ${variableName} is empty`);
		return null;
	}

	if (variableName.endsWith(".json5")) {
		try {
			// Check if the content needs to be base64 decoded
			const firstChar = parsedConfig[0];
			if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"') {
				parsedConfig = Buffer.from(parsedConfig, "base64").toString(
					"utf8",
				);
			}

			// Parse JSON5
			return json5.parse(parsedConfig);
		} catch (error) {
			console.log(`⚠️ `, `Failed to parse ${variableName}`);
			return null;
		}
	}

	return parsedConfig as any;
}
