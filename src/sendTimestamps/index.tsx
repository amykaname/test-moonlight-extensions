import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("sendTimestamps");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            { ext: "commands", id: "commands" }
        ],
        entrypoint: true
    },
};
