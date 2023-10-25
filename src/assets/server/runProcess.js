import { createPromise } from "@/assets/common/createPromise";
import { spawn } from "child_process";

/**
 * Runs a script with parameters.
 *
 * @param {string} script - The path to the script to run.
 * @param {Array<string>} [params] - An array of parameters to pass to the script.
 *
 * @returns {Promise<{
 * 	   log: string,
 *     stdout: string,
 *     stderr: string
 * }>} - Resolves to an object containing the output of the script.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * const { log, stdout, stderr } = await run("ls", ["-1", "~/"]);
 */
export async function runProcess(script, params = []) {
	if (typeof script !== "string") {
		throw new TypeError(
			`run(script, params?) : 'script' must be a string.`,
		);
	}

	if (!Array.isArray(params)) {
		throw new TypeError(
			`run(script, params?) : 'params' is optional, but must be an array.`,
		);
	}

	let log = ""; //  Both out/err in the order they appeared in
	let stdout = "";
	let stderr = "";

	const pr = createPromise();

	const child = spawn(script, params);
	child.on("exit", (code) => {
		const data = {
			log,
			stdout,
			stderr,
		};

		if (code === 0) {
			pr.resolve(data);
		} else {
			console.log(log);
			pr.reject();
		}
	});

	child.stdout.setEncoding("utf8");
	child.stderr.setEncoding("utf8");

	child.stdout.on("data", (data) => {
		stdout += data;
		log += data;
	});

	child.stderr.on("data", (data) => {
		stderr += data;
		log += data;
	});

	return pr.promise;
}
