/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { randomBytes } from "crypto";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { NonceProvider } from "~/components/Nonce";

const DEV = process.env.NODE_ENV !== "production";

const ABORT_DELAY = 5_000;

function setSecurityHeaders(responseHeaders: Headers, nonce?: string) {
	const scripts = [];

	if (DEV) {
		// Development only
		scripts.push("'unsafe-inline'");
	}

	if (nonce) {
		scripts.push(`'strict-dynamic' 'nonce-${nonce}'`);
	}

	Object.entries({
		"Content-Security-Policy": Object.entries({
			"default-src": ["'none'"],
			"script-src": ["'self'", ...scripts],
			"style-src": ["'self'", "'unsafe-inline'"],
			"manifest-src": ["'self'"],
			"connect-src": ["'self'"],
			"font-src": ["'self'", "data:", "blob:"],
			"img-src": ["'self'", "data:", "blob:"],
			"media-src": ["'self'", "data:", "blob:"],
			"worker-src": ["'self'"],
			"form-action": ["'self'"],
			"base-uri": ["'self'"],
			"frame-ancestors": ["'self'"],
		})
			.map(([k, v]) => `${k} ${v.join(" ")}`)
			.join("; "),
		"Cross-Origin-Opener-Policy": "same-origin",
		"Cross-Origin-Embedder-Policy": "require-corp",
		"Referrer-Policy": "same-origin",
		"Strict-Transport-Security":
			"max-age=31536000; includeSubDomains; preload",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "SAMEORIGIN",
		"X-XSS-Protection": "1; mode=block",
	}).forEach(([k, v]) => responseHeaders.set(k, v));
}

let firstRun = true;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	loadContext: AppLoadContext,
) {
	return new Promise((resolve, reject) => {
		if (firstRun) {
			firstRun = false;

			console.log(` ℹ️ `, `Starting up services`);
			// await doSomething
			console.log(` ℹ️ `, `Services are ready`);
		}

		let shellRendered = false;

		const nonce = randomBytes(16).toString("hex");

		const { pipe, abort } = renderToPipeableStream(
			<NonceProvider value={nonce}>
				<RemixServer
					nonce={nonce}
					context={remixContext}
					url={request.url}
					abortDelay={ABORT_DELAY}
				/>
			</NonceProvider>,
			{
				onShellReady() {
					shellRendered = true;
					const body = new PassThrough();
					const stream = createReadableStreamFromReadable(body);

					setSecurityHeaders(responseHeaders, nonce);

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(stream, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
