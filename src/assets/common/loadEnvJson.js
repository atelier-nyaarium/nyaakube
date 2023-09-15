import json5 from "json5";

export default function loadEnvJson(variableName) {
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
		const ch = parsedConfig[0];
		if (ch !== "{" && ch !== "[") {
			parsedConfig = Buffer.from(parsedConfig, "base64").toString("utf8");
		}

		parsedConfig = json5.parse(parsedConfig);
	} catch (error) {
		console.log(`⚠️ `, `Failed to parse ${variableName}`);
		return null;
	}

	return parsedConfig;
}
