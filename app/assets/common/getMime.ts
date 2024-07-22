/**
 * Returns the MIME type of a file based on its extension.
 *
 * @param fileName - The name of the file.
 * @returns The MIME type of the file.
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * const mime = getMime("Gachi.mp3");
 * -> "audio/mpeg"
 */
export function getMime(fileName: string): string {
	if (typeof fileName !== "string") {
		throw new TypeError(`getMime(fileName) : 'fileName' must be a string.`);
	}

	const name = fileName.toLowerCase();

	if (/(^|\.)(txt)$/.test(name)) return "text/plain";
	if (/(^|\.)(html|htm)$/.test(name)) return "text/html";
	if (/(^|\.)(js)$/.test(name)) return "text/javascript";
	if (/(^|\.)(json)$/.test(name)) return "application/json";
	if (/(^|\.)(pdf)$/.test(name)) return "application/pdf";
	if (/(^|\.)(bmp)$/.test(name)) return "image/bmp";
	if (/(^|\.)(gif)$/.test(name)) return "image/gif";
	if (/(^|\.)(jpg|jpeg)$/.test(name)) return "image/jpeg";
	if (/(^|\.)(png|apng)$/.test(name)) return "image/png";
	if (/(^|\.)(svg)$/.test(name)) return "image/svg+xml";
	if (/(^|\.)(webp)$/.test(name)) return "image/webp";
	if (/(^|\.)(ico)$/.test(name)) return "image/x-icon";
	if (/(^|\.)(aac)$/.test(name)) return "audio/aac";
	if (/(^|\.)(mp3)$/.test(name)) return "audio/mpeg";
	if (/(^|\.)(ogg)$/.test(name)) return "audio/ogg";
	if (/(^|\.)(wav)$/.test(name)) return "audio/wav";
	if (/(^|\.)(webm)$/.test(name)) return "audio/webm";
	if (/(^|\.)(mp4)$/.test(name)) return "video/mp4";
	if (/(^|\.)(mkv)$/.test(name)) return "video/x-matroska";
	if (/(^|\.)(otf)$/.test(name)) return "font/otf";
	if (/(^|\.)(ttf)$/.test(name)) return "font/ttf";
	if (/(^|\.)(woff)$/.test(name)) return "font/woff";
	if (/(^|\.)(woff2)$/.test(name)) return "font/woff2";

	return "application/octet-stream";
}
