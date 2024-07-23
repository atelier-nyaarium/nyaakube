import { lstatSync, readdirSync } from "fs";
import { join as pathJoin } from "path";
import { sanitizePath } from "~/assets/server/sanitizePath";

interface ScanResult {
	dirs: string[];
	files: string[];
}

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
 * @param workDir - The working directory to resolve paths from.
 * @param filePath - The relative path to scan.
 *
 * @returns The list of directories and files. null if the path does not exist.
 *
 * @throws TypeError if the parameter types are incorrect.
 * @throws Error if the path is outside the working directory.
 *
 * @example
 * const scan = fsSafeScanDirectory("/var/data", "public");
 * -> {
 *     dirs: ["images", "videos"],
 *     files: ["index.html"],
 * }
 */
export function fsSafeScanDirectory(
	workDir: string,
	filePath: string,
): ScanResult | null {
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

	const retFiles: string[] = [];
	const retDirs: string[] = [];

	try {
		const safePathFS = sanitizePath(workDir, filePath);

		const files = readdirSync(safePathFS);
		for (const filename of files) {
			// filename comes from our own filesystem, so it's safe
			const safeFilePathFS = pathJoin(safePathFS, filename);

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
