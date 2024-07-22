import { spawn } from "child_process";
import { createPromise } from "~/assets/common/createPromise";

interface RunProcessResult {
	log: string;
	stdout: string;
	stderr: string;
}

/**
 * Runs a script with parameters.
 *
 * @param script - The path to the script to run.
 * @param params - An array of parameters to pass to the script.
 *
 * @returns Resolves to an object containing the output of the script.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * const { log, stdout, stderr } = await runProcess("ls", ["-1", "~/"]);
 */
export async function runProcess(
	script: string,
	params: string[] = [],
): Promise<RunProcessResult> {
	if (typeof script !== "string") {
		throw new TypeError(
			`runProcess(script, params?) : 'script' must be a string.`,
		);
	}

	if (!Array.isArray(params)) {
		throw new TypeError(
			`runProcess(script, params?) : 'params' is optional, but must be an array of strings.`,
		);
	}

	let log = ""; // Both out/err in the order they appeared in
	let stdout = "";
	let stderr = "";

	const pr = createPromise<RunProcessResult>();

	const child = spawn(script, params);
	child.on("exit", (code) => {
		const data: RunProcessResult = {
			log,
			stdout,
			stderr,
		};

		if (code === 0) {
			pr.resolve(data);
		} else {
			console.log(log);
			pr.reject(new Error(`Process exited with code ${code}`));
		}
	});

	child.stdout.setEncoding("utf8");
	child.stderr.setEncoding("utf8");

	child.stdout.on("data", (data: string) => {
		stdout += data;
		log += data;
	});

	child.stderr.on("data", (data: string) => {
		stderr += data;
		log += data;
	});

	return pr.promise;
}
