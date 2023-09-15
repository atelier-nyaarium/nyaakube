import { createHash } from "crypto";

export default function sha512(data) {
	const hash = createHash("sha512");
	hash.update(data);
	return hash.digest("hex");
}
