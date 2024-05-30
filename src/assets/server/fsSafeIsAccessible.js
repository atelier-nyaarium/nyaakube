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
 * @param {string} filePath - The relative path to sanitize.
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
