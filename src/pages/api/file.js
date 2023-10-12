import createApiHandler from "@/assets/server/createApiHandler";
import getEnv from "@/assets/server/getEnv";
import respondError from "@/assets/server/respondError";
import safeIsFileAccessible from "@/assets/server/safeIsFileAccessible";
import sanitizePath from "@/assets/server/sanitizePath";
import validateTOTP from "@/assets/server/validateTOTP";
import fs from "fs";
import path from "path";

const BASE_PUBLIC = path.join(process.env.DATA_PATH, "public");
const BASE_UNLISTED = path.join(process.env.DATA_PATH, "unlisted");
const BASE_PROTECTED = path.join(process.env.DATA_PATH, "protected");
const SERVE_BASE_HANDLERS = Object.freeze({
	[BASE_PUBLIC]: servePublic,
	[BASE_UNLISTED]: serveUnlisted,
	[BASE_PROTECTED]: serveProtected,
});

export default createApiHandler({
	label: __filename,
	time: false,
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
