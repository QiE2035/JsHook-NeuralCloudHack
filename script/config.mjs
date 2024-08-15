import esbuild from "esbuild";
/**
 * @type {esbuild.BuildOptions}
 */
export const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  minify: true,
};
