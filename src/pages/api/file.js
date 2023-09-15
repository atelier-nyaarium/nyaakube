import createApiHandler from "@/assets/server/createApiHandler";
import respondError from "@/assets/server/respondError";
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
	handler: async (req, res) => {
		for (const basePath in SERVE_BASE_HANDLERS) {
			const serveHandler = SERVE_BASE_HANDLERS[basePath];

			const safePath = sanitizePath(basePath, req.data?.path);
			if (!isFileAccessible(safePath)) continue;

			return serveHandler(req, res, basePath, req.data?.path);
		}

		return respondError(req, res, `File not found`, 404);
	},
});

async function servePublic(req, res, basePath, filePath) {
	const safePath = sanitizePath(basePath, filePath);
	if (!isFileAccessible(safePath)) {
		return respondError(req, res, `File not found`, 404);
	}

	// Pipe file reader to response `res`
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePath);
	fileStream.pipe(res);
}

async function serveUnlisted(req, res, basePath, filePath) {
	const safePath = sanitizePath(basePath, filePath);
	if (!isFileAccessible(safePath)) {
		return respondError(req, res, `File not found`, 404);
	}

	// Pipe file reader to response `res`
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePath);
	fileStream.pipe(res);
}

async function serveProtected(req, res, basePath, filePath) {
	const safePath = sanitizePath(basePath, filePath);
	if (!isFileAccessible(safePath)) {
		return respondError(req, res, `File not found`, 404);
	}

	const resValid = await validateTOTP(
		process.env.PUBLIC_TOTP_SECRET,
		req.data?.token,
	);
	if (!resValid.valid) {
		// TODO: Make a shield create shield handler.
		//       Rate limit by IP
		return respondError(req, res, resValid.message, resValid.code);
	}

	// Pipe file reader to response `res`
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const fileStream = fs.createReadStream(safePath);
	fileStream.pipe(res);
}

function isFileAccessible(filePath) {
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return fs.lstatSync(filePath).isFile();
	} catch (error) {
		return false;
	}
}
