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
 * @param {string} workingDir - The working directory to resolve paths from.
 * @param {string} filePath - The relative path to sanitize.
 *
 * @returns string - The resolved path.
 *
 * @throws TypeError if the parameter types are bad.
 * @throws Error if the path is outside the working directory.
 *
 * @example
 * const safePath = sanitizePath("/var/data", "Foo̵̔̐Bã̸r?.txt");
 * -> "/var/data/FooBar.txt"
 */
export function sanitizePath(workingDir, filePath) {
	if (typeof workingDir !== "string") {
		throw new TypeError(
			`sanitizePath(workingDir, filePath) : 'workingDir' must be a string.`,
		);
	}

	if (typeof filePath !== "string") {
		throw new TypeError(
			`sanitizePath(workingDir, filePath) : 'filePath' must be a string.`,
		);
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
