import {
	createApiHandler,
	getEnv,
	respondError,
	respondJson,
	scanDirectory,
} from "@/assets/server";
import path from "path";

const DATA_PATH = getEnv("DATA_PATH");
const BASE_UNLISTED = path.join(DATA_PATH, "unlisted");
const BASE_GALLERY = path.join(BASE_UNLISTED, "gallery");

export default createApiHandler({
	label: __filename,
	handler: async (req, res) => {
		if (!req.data?.path) {
			return respondError(
				req,
				res,
				`Expected a path, got: ${req.data.path}`,
				400,
			);
		}

		const listing = scanDirectory(BASE_GALLERY, req.data?.path);

		for (let i = listing.dirs.length - 1; 0 <= i; i--) {
			const dir = listing.dirs[i];
			const dirName = dir.split("/").pop();
			if (/nsfw/i.test(dirName)) {
				listing.dirs.splice(i, 1);
			}
		}

		return respondJson(res, listing);
	},
});
