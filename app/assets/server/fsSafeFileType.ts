import { lstatSync } from "fs";
import { sanitizePath } from "~/assets/server/sanitizePath";

/**
 * Sanitize and check the file's type.
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
 * @param workDir - The working directory to resolve paths from.
 * @param filePath - The relative path to check.
 *
 * @returns - Type as one of "file" or "directory", or false if it inaccessible.
 *
 * @throws TypeError if the parameter types are incorrect.
 * @throws Error if the path is outside the working directory.
 *
 * @example
 * if (fsSafeFileType("/var/data", "Foo̵̔̐Bã̸r?.txt")) {
 *   // Do something
 * }
 */
export function fsSafeFileType(
	workDir: string,
	filePath: string,
): "file" | "directory" | false {
	if (typeof workDir !== "string") {
		throw new TypeError(
			`fsSafeFileType(workDir, filePath) : 'workDir' must be a string.`,
		);
	}

	if (typeof filePath !== "string") {
		throw new TypeError(
			`fsSafeFileType(workDir, filePath) : 'filePath' must be a string.`,
		);
	}

	try {
		const safePathFS = sanitizePath(workDir, filePath);

		const stats = lstatSync(safePathFS);

		if (stats.isFile()) {
			return "file";
		} else if (stats.isDirectory()) {
			return "directory";
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}
