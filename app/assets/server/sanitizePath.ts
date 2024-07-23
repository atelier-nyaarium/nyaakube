import { normalize, join as pathJoin } from "path";

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
 * @param workingDir - The working directory to resolve paths from.
 * @param filePath - The relative path to sanitize.
 *
 * @returns The resolved path.
 *
 * @throws TypeError if the parameter types are incorrect.
 * @throws Error if the path is outside the working directory.
 *
 * @example
 * const safePath = sanitizePath("/var/data", "Foo̵̔̐Bã̸r?.txt");
 * -> "/var/data/FooBar.txt"
 */
export function sanitizePath(workingDir: string, filePath: string): string {
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

	const resolvedPath = normalize(
		pathJoin(
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
					normalize(
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
