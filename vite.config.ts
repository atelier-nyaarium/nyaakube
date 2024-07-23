import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default ({ command }: any) => {
	const ssr: any = {};

	if (command === "build") {
		ssr.noExternal = true;
		ssr.external = ["argon2"];
	}

	return defineConfig({
		server: {
			port: 3000,
		},
		plugins: [
			remix({
				future: {
					v3_fetcherPersist: true,
					v3_relativeSplatPath: true,
					v3_throwAbortReason: true,
					// unstable_singleFetch: true,
				},
			}),
			tsconfigPaths(),
		],
		ssr,
	});
};
