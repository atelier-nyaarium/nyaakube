import { sanitizePath } from "@/assets/server/sanitizePath";
import { lstatSync, readdirSync } from "fs";
import path from "path";

/**
 * Sanitize and scan directory
 *
 * Paths will be sanitized. They are only allowed to contain:
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
 * @param {string} filePath - The relative path to scan.
 *
 * @returns {{
 *     dirs: string[],
 *     files: string[],
 * } | null} - The list of directories and files. null if the path does not exist.
 *
 * @throws TypeError if the parameter types are bad.
 * @throws Error if the path is outside the working directory.
 *
 * @example
 * const scan = scanDirectory("/var/data", "public");
 * -> {
 *     dirs: ["images", "videos"],
 *     files: ["index.html"],
 * }
 */
export function fsSafeScanDirectory(workDir, filePath) {
	if (typeof workDir !== "string") {
		throw new TypeError(
			`fsSafeScanDirectory(workDir, filePath) : 'workDir' must be a string.`,
		);
	}

	if (typeof filePath !== "string") {
		throw new TypeError(
			`fsSafeScanDirectory(workDir, filePath) : 'filePath' must be a string.`,
		);
	}

	const retFiles = [];
	const retDirs = [];

	try {
		const safePathFS = sanitizePath(workDir, filePath);

		const files = readdirSync(safePathFS);
		for (const filename of files) {
			// filename comes from our own filesystem, so it's safe
			const safeFilePathFS = path.join(safePathFS, filename);

			const stats = lstatSync(safeFilePathFS);

			if (stats.isFile()) {
				retFiles.push(filename);
			} else if (stats.isDirectory()) {
				retDirs.push(filename);
			}
		}

		return {
			dirs: retDirs,
			files: retFiles,
		};
	} catch (error) {
		return null;
	}
}
