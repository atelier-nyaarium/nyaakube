import sanitizePath from "@/assets/server/sanitizePath";
import fs from "fs";
import path from "path";

/**
 * Scan Directory
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
 * @param {string} basePath - The directory to resolve paths from. Paths cannot escape above this.
 * @param {string} filePath - The relative path to scan
 *
 * @returns {{dirs: string[], files: string[]}} - The list of directories and files
 */
export default function scanDirectory(basePath, filePath) {
	const retFiles = [];
	const retDirs = [];

	const safePathFS = sanitizePath(basePath, filePath);

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	if (!fs.existsSync(safePathFS)) {
		return {
			dirs: [],
			files: [],
		};
	}

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const files = fs.readdirSync(safePathFS);
	for (const filename of files) {
		const pathStr = path.join(safePathFS, filename);

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const isDir = fs.lstatSync(pathStr).isDirectory();
		if (isDir) {
			retDirs.push(filename);
		} else {
			retFiles.push(filename);
		}
	}

	return {
		dirs: retDirs,
		files: retFiles,
	};
}
