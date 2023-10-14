/**
 * Returns the MIME type of a file based on its extension.
 *
 * @param {string} fileName - The name of the file.
 *
 * @returns {string} - The MIME type of the file.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * const mime = getMime("Gachi.mp3");
 * -> "audio/mpeg"
 */
export function getMime(fileName) {
	if (typeof fileName !== "string") {
		throw new TypeError(`getMime(fileName) : 'fileName' must be a string.`);
	}

	fileName = fileName.toLowerCase();

	if (/(^|\.)(txt)$/.test(fileName)) return "text/plain";
	if (/(^|\.)(html|htm)$/.test(fileName)) return "text/html";
	if (/(^|\.)(js)$/.test(fileName)) return "text/javascript";
	if (/(^|\.)(json)$/.test(fileName)) return "application/json";
	if (/(^|\.)(pdf)$/.test(fileName)) return "application/pdf";
	if (/(^|\.)(bmp)$/.test(fileName)) return "image/bmp";
	if (/(^|\.)(gif)$/.test(fileName)) return "image/gif";
	if (/(^|\.)(jpg|jpeg)$/.test(fileName)) return "image/jpeg";
	if (/(^|\.)(png|apng)$/.test(fileName)) return "image/png";
	if (/(^|\.)(svg)$/.test(fileName)) return "image/svg+xml";
	if (/(^|\.)(webp)$/.test(fileName)) return "image/webp";
	if (/(^|\.)(ico)$/.test(fileName)) return "file/x-icon";
	if (/(^|\.)(aac)$/.test(fileName)) return "audio/aac";
	if (/(^|\.)(mp3)$/.test(fileName)) return "audio/mpeg";
	if (/(^|\.)(ogg)$/.test(fileName)) return "audio/ogg";
	if (/(^|\.)(wav)$/.test(fileName)) return "audio/wav";
	if (/(^|\.)(webm)$/.test(fileName)) return "audio/webm";
	if (/(^|\.)(mp4)$/.test(fileName)) return "video/mp4";
	if (/(^|\.)(mkv)$/.test(fileName)) return "video/x-matroska";
	if (/(^|\.)(otf)$/.test(fileName)) return "font/otf";
	if (/(^|\.)(ttf)$/.test(fileName)) return "font/ttf";
	if (/(^|\.)(woff)$/.test(fileName)) return "font/woff";
	if (/(^|\.)(woff2)$/.test(fileName)) return "font/woff2";

	return "application/octet-stream";
}
