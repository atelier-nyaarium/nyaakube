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

	const safePath = sanitizePath(basePath, filePath);

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	if (!fs.existsSync(safePath)) {
		return {
			dirs: [],
			files: [],
		};
	}

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const files = fs.readdirSync(safePath);
	for (const filename of files) {
		const pathStr = path.join(safePath, filename);

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const isDir = fs.lstatSync(pathStr).isDirectory();
		if (isDir) {
			retDirs.push(path.join(filePath, filename));
		} else {
			retFiles.push(path.join(filePath, filename));
		}
	}

	return {
		dirs: retDirs,
		files: retFiles,
	};
}
