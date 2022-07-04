import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import livereload from "rollup-plugin-livereload";
import sveltePreprocess from "svelte-preprocess";
import css from "rollup-plugin-css-only";
import { writeFileSync, mkdirSync } from "fs";

const isDevelopment = !!process.env.ROLLUP_WATCH;

module.exports = {
	input: "src/client/index.ts",
	output: {
		file: "dist/public/index.js",
		sourcemap: true,
		format: "iife",
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: true }),
			compilerOptions: { dev: isDevelopment },
		}),
		css({
			output: (styles, styleNodes) => {
				// To ensure the CSS files are compiled in the same order on every build,
				// sort alphabetically by the CSS file's path.
				const orderedStyles = Object.keys(styleNodes)
					.sort()
					.map((fromFile) =>
						styleNodes[fromFile]
							.replace(/([^{};]+)([;}])/g, "\t$1$2\n")
							.replace(/{/g, " {\n")
							.replace(/}/g, ";\n}")
					)
					.join("\n");
				mkdirSync("dist/public", { recursive: true });
				writeFileSync("dist/public/bundle.css", orderedStyles);
			},
		}),
		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs({
			include: "node_modules/**",
			extensions: [".js", ".ts"],
		}),
		typescript({
			tsconfig: "src/client/tsconfig.json",
			sourceMap: true,
		}),
		isDevelopment && livereload({ watch: "./dist/public" }),
	],
	watch: {
		clearScreen: false,
	},
};
