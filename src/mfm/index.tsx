import type { ExtensionWebExports } from "@moonlight-mod/types";
import { mfmStyle } from "./webpackModules/entrypoint/mfm.css.js";

const logger = moonlight.getLogger("mfm");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: 'type:"GUILD_ROLE_CONNECTIONS_MODAL_SHOW",',
        replace: [{
            match: /codeBlock:\{react\((\i),(\i),(\i)\)\{/,
            replacement: `$&
                {
                    const __return = require("mfm_entrypoint").patchCodeBlock(arguments[0], arguments[1], arguments[2]);
                    if (__return !== undefined) {
                        return __return;
                    }
                }
            `
        }]
    }
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        entrypoint: true,
        dependencies: [
            { id: 'react' },
        ]
    },
};

export const styles: ExtensionWebExports["styles"] = [mfmStyle];