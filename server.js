const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const path = require("path");
const fs = require("fs");
const nodeFetch = require("node-fetch");

const dev = process.env.NODE_ENV !== "production";
if (dev) {
	const dotenv = require("dotenv");
	dotenv.config();
}

const port = parseInt(process.env.PORT, 10) || (dev ? 3000 : 80);

const app = next({ dev, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

if (!process.env.DATA_PATH) {
	throw new Error(`Expected environment variable DATA_PATH`);
}

const BASE_PUBLIC = path.join(process.env.DATA_PATH, "public");
const BASE_UNLISTED = path.join(process.env.DATA_PATH, "unlisted");
const BASE_PROTECTED = path.join(process.env.DATA_PATH, "protected");
const SERVABLE_BASE_PATHS = Object.freeze([
	BASE_PROTECTED,
	BASE_UNLISTED,
	BASE_PUBLIC,
]);

function routeHandler(req, res, parsedUrl, next) {
	const { pathname } = parsedUrl;

	// If begins with /files/
	//    Trim: /files/path/to/file.ext
	//      To: path/to/file.ext
	if (pathname.startsWith("/files/")) {
		const filePath = pathname.substring("/files/".length);

		// If the file exists, redirect to file serve API
		for (const basePath of SERVABLE_BASE_PATHS) {
			if (!safeIsFileAccessible(basePath, filePath)) continue;

			try {
				let rawQuery = req.url.split("?")[1] ?? "";
				if (rawQuery) rawQuery = `?${rawQuery}`;

				return nodeFetch(
					`http://localhost:${port}/api/file${rawQuery}`,
					{
						method: "post",
						body: JSON.stringify({ path: filePath }),
					},
				)
					.then((fetchRes) => {
						return fetchRes.body.pipe(res);
					})
					.catch((error) => {
						console.log(`⛔ `, `Error during file route`);
						console.error(error);
						return res.destroy();
					});
			} catch (error) {
				console.log(`⛔ `, `Error fetching file route`);
				console.error(error);
				return res.destroy();
			}
		}
	}

	// Else, do the rest of the handlers
	return next();
}

app.prepare()
	.then(() => {
		createServer((req, res) => {
			const parsedUrl = parse(req.url, true);
			try {
				return routeHandler(req, res, parsedUrl, () => {
					return handle(req, res, parsedUrl);
				});
			} catch (error) {
				console.log(`⛔ `, `Error in route:`, parsedUrl.pathname);
				console.error(error);
				res.statusCode = 500;
				res.end("Internal server error");
			}
		})
			.once("error", (error) => {
				console.log(`⛔ `, `Error starting server`);
				console.error(error);
				process.exit(1);
			})
			.listen(port, async () => {
				try {
					await initOnce();

					console.log(` ℹ️ `, `Ready on http://0.0.0.0:${port}`);
				} catch (error) {
					console.log(`⛔ `, `Error starting server`);
					console.error(error);
					process.exit(1);
				}
			});
	})
	.catch((error) => {
		console.log(`⛔ `, `Error starting server`);
		console.error(error);
		process.exit(1);
	});

process.once("SIGINT", (code) => {
	console.log(`SIGINT received`);
	process.exit();
});

process.once("SIGTERM", (code) => {
	console.log(`SIGTERM received`);
	process.exit();
});

// Some services are written under the ES6 src/ directory. This initializes them once.
// The service initialization piggybacks off the health check.
async function initOnce() {
	try {
		console.log(` ℹ️ `, `Running first time health-check`);
		const res = await fetch(`http://localhost:${port}/api/health-check`);

		if (res.status !== 200) {
			console.log(res.status, res.statusText);
			throw new Error(`Health check failed`);
		}
	} catch (error) {
		console.log(`⛔ `, `Error initiating health-check`);
		console.error(error);
		process.exit(1);
	}
}

function safeIsFileAccessible(basePath, filePath) {
	try {
		const safePathFS = sanitizePath(basePath, filePath);

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return fs.lstatSync(safePathFS).isFile();
	} catch (error) {
		return false;
	}
}

function sanitizePath(workingDir, routePath) {
	if (typeof workingDir !== "string") {
		throw new Error(`Expected a working directory path string`);
	}

	if (typeof routePath !== "string") {
		throw new Error(`Expected a route path string`);
	}

	const resolvedPath = path.normalize(
		path.join(
			workingDir,
			routePath
				// Protocol
				.replace(/^\w+:\/\//, "")

				// Split by path separator
				.split(/[\\/]/)

				// Remove invalid characters:
				//   - Decode URI encodings
				//   - Remove strange characters
				//   - Trim whitespace
				//   - Resolve . and ..
				.map((s) =>
					path.normalize(
						decodeURIComponent(s)
							.replace(/[^a-zA-Z0-9 _,.()-]/g, "")
							.trim(),
					),
				)

				.join("/"),
		),
	);

	if (!resolvedPath.startsWith(workingDir)) {
		console.log(
			`⛔ `,
			`Path traversal detected\n       Working Path: ${workingDir}\n      Resolved Path: ${resolvedPath}`,
		);
		throw new Error(`Stay in your sandbox like a good kid!`);
	}

	return resolvedPath;
}
