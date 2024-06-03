import { sanitizePath } from "@/assets/server/sanitizePath";
import { lstatSync } from "fs";

/**
 * Sanitize and check if a file is accessible.
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
 * @param {string} workDir - The working directory to resolve paths from.
 * @param {string} filePath - The relative path to check.
 *
 * @returns {boolean} - Whether the file is accessible.
 *
 * @throws TypeError if the parameter types are bad.
 * @throws Error if the path is outside the working directory.
 *
 * @example
 * if (safeIsFileAccessible("/var/data", "Foo̵̔̐Bã̸r?.txt"))
 */
export function fsSafeIsAccessible(workDir, filePath) {
	if (typeof workDir !== "string") {
		throw new TypeError(
			`fsSafeIsAccessible(workDir, filePath) : 'workDir' must be a string.`,
		);
	}

	if (typeof filePath !== "string") {
		throw new TypeError(
			`fsSafeIsAccessible(workDir, filePath) : 'filePath' must be a string.`,
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
