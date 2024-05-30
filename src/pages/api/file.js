import {
	createApiHandler,
	fsSafeIsAccessible,
	getEnv,
	respondError,
	sanitizePath,
	validateTOTP,
} from "@/assets/server";
import fs from "fs";
import path from "path";

const DATA_PATH = getEnv("DATA_PATH");
const BASE_PUBLIC = path.join(DATA_PATH, "public");
const BASE_UNLISTED = path.join(DATA_PATH, "unlisted");
const BASE_PROTECTED = path.join(DATA_PATH, "protected");
const SERVE_BASE_HANDLERS = Object.freeze({
	[BASE_PROTECTED]: serveProtected,
	[BASE_UNLISTED]: serveUnlisted,
	[BASE_PUBLIC]: servePublic,
});
fs.mkdirSync(BASE_PUBLIC, { recursive: true });
fs.mkdirSync(BASE_UNLISTED, { recursive: true });
fs.mkdirSync(BASE_PROTECTED, { recursive: true });

export default createApiHandler({
	label: __filename,
	async handler(req, res) {
		// Scan for files first
		for (const basePath in SERVE_BASE_HANDLERS) {
			const serveHandler = SERVE_BASE_HANDLERS[basePath];

			const type = fsSafeIsAccessible(basePath, req.data?.path);
			if (type !== "file") continue;

			return serveHandler(req, res, type, basePath, req.data?.path);
		}

		// Scan for directories next
		for (const basePath in SERVE_BASE_HANDLERS) {
			const serveHandler = SERVE_BASE_HANDLERS[basePath];

			const type = fsSafeIsAccessible(basePath, req.data?.path);
			if (type !== "directory") continue;

			return serveHandler(req, res, type, basePath, req.data?.path);
		}

		return respondError(req, res, `File not found`, 404);
	},
});

async function servePublic(req, res, type, basePath, filePath) {
	if (!fsSafeIsAccessible(basePath, req.data?.path)) {
		return respondError(req, res, `File not found`, 404);
	}

	const safePathFS = sanitizePath(basePath, filePath);

	// Check if exists, and if file or directory
	if (!fs.existsSync(safePathFS)) {
		return respondError(req, res, `File not found`, 404);
	}

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePathFS);

	// Pipe file reader to response `res`
	fileStream.pipe(res);
}

async function serveUnlisted(req, res, type, basePath, filePath) {
	if (!fsSafeIsAccessible(basePath, filePath)) {
		return respondError(req, res, `File not found`, 404);
	}

	const safePathFS = sanitizePath(basePath, filePath);

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePathFS);

	// Pipe file reader to response `res`
	fileStream.pipe(res);
}

async function serveProtected(req, res, type, basePath, filePath) {
	if (!fsSafeIsAccessible(basePath, filePath)) {
		return respondError(req, res, `File not found`, 404);
	}

	const resValid = await validateTOTP(
		getEnv("PUBLIC_TOTP_SECRET"),
		req.data?.token,
	);
	if (!resValid.valid) {
		// TODO: Rate limit by IP
		return respondError(req, res, resValid.message, resValid.code);
	}

	const safePathFS = sanitizePath(basePath, filePath);

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePathFS);

	// Pipe file reader to response `res`
	fileStream.pipe(res);
}
