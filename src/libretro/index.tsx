import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("libretro");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [{
    find: /let{className:(\w+),url:(\w+),fileName:(\w+),fileSize:(\w+),onClick:(\w+),onContextMenu:(\w+),renderAdjacentContent:(\w+)}=(\w+);/,
    replace: [{
        match: /let{className:(\w+),url:(\w+),fileName:(\w+),fileSize:(\w+),onClick:(\w+),onContextMenu:(\w+),renderAdjacentContent:(\w+)}=(\w+);/,
        replacement: (orig, className, url, fileName, fileSize, onClick, onContextMenu, renderAdjacentContent, origVar) => {
            return `${orig}
            let __tempVar1 = require('libretro_entrypoint').handleFileEmbed(${origVar});
            if (__tempVar1 !== undefined) {
                return __tempVar1;
            }
            `;
        },
    }]
}];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            'react'
        ],
        entrypoint: true
    },
};
