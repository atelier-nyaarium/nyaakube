import { createHash } from "crypto";

export default function sha256(data) {
	const hash = createHash("sha256");
	hash.update(data);
	return hash.digest("hex");
}
