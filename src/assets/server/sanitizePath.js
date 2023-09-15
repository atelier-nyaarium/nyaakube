import path from "path";

/**
 * Sanitize Path
 *
 * Paths are only allowed to contain:
 *     spaces
 *     a-z
 *     A-Z
 *     0-9
 *     _
 *     ,
 *     .
 *     -
 *
 * @param {string} workingDir - The working directory to resolve paths from
 * @param {string} filePath - The relative path to sanitize
 *
 * @returns string - The resolved path
 *
 * @throws Error if the path is outside the working directory
 */
export default function sanitizePath(workingDir, filePath) {
	if (typeof workingDir !== "string") {
		throw new Error(`Expected a working directory path string`);
	}

	if (typeof filePath !== "string") {
		throw new Error(`Expected a route path string`);
	}

	const resolvedPath = path.normalize(
		path.join(
			workingDir,
			filePath
				// Protocol
				.replace(/^\w+:\/\//, "")

				// Split by path separator
				.split(/[\\/]/)

				// Remove invalid characters:
				//   - Decode URI encodings
				//   - Remove strange characters
				//   - Trim whitespace
				//   - Resolve . and ..
				.map((s) =>
					path.normalize(
						decodeURIComponent(s)
							.replace(/[^a-zA-Z0-9 _,.()-]/g, "")
							.trim(),
					),
				)

				.join("/"),
		),
	);

	if (!resolvedPath.startsWith(workingDir)) {
		console.log(
			`⛔ `,
			`Path traversal detected\n       Working Path: ${workingDir}\n      Resolved Path: ${resolvedPath}`,
		);
		throw new Error(`Stay in your sandbox like a good kid!`);
	}

	return resolvedPath;
}
