import {
	createApiHandler,
	getEnv,
	respondError,
	safeIsFileAccessible,
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

export default createApiHandler({
	label: __filename,
	handler: async (req, res) => {
		for (const basePath in SERVE_BASE_HANDLERS) {
			const serveHandler = SERVE_BASE_HANDLERS[basePath];

			if (!safeIsFileAccessible(basePath, req.data?.path)) continue;

			return serveHandler(req, res, basePath, req.data?.path);
		}

		return respondError(req, res, `File not found`, 404);
	},
});

async function servePublic(req, res, basePath, filePath) {
	if (!safeIsFileAccessible(basePath, req.data?.path)) {
		return respondError(req, res, `File not found`, 404);
	}

	const safePathFS = sanitizePath(basePath, filePath);

	// Pipe file reader to response `res`
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePathFS);

	fileStream.pipe(res);
}

async function serveUnlisted(req, res, basePath, filePath) {
	if (!safeIsFileAccessible(basePath, filePath)) {
		return respondError(req, res, `File not found`, 404);
	}

	const safePathFS = sanitizePath(basePath, filePath);

	// Pipe file reader to response `res`
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePathFS);

	fileStream.pipe(res);
}

async function serveProtected(req, res, basePath, filePath) {
	if (!safeIsFileAccessible(basePath, filePath)) {
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

	// Pipe file reader to response `res`
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePathFS);

	fileStream.pipe(res);
}
