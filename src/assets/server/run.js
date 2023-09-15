import createPromise from "@/assets/common/createPromise";
import { spawn } from "child_process";

export default async function run(script, params = []) {
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
