import createApiHandler from "@/assets/server/createApiHandler";
import respondError from "@/assets/server/respondError";
import respondJson from "@/assets/server/respondJson";
import scanDirectory from "@/assets/server/scanDirectory";
import path from "path";

const BASE_UNLISTED = path.join(process.env.DATA_PATH, "unlisted");

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
