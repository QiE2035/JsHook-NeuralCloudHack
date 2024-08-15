import esbuild from "esbuild";
import { config } from "./config.mjs";

const context = await esbuild.context(config);
console.log("Watching...");
await context.watch();
