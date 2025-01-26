import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("ruffle");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [{
    find: /let{className:(\w+),url:(\w+),fileName:(\w+),fileSize:(\w+),onClick:(\w+),onContextMenu:(\w+),renderAdjacentContent:(\w+)}=(\w+);/,
    replace: [{
        match: /let{className:(\w+),url:(\w+),fileName:(\w+),fileSize:(\w+),onClick:(\w+),onContextMenu:(\w+),renderAdjacentContent:(\w+)}=(\w+);/,
        replacement: (orig, className, url, fileName, fileSize, onClick, onContextMenu, renderAdjacentContent, origVar) => {
            return `${orig}
            let __tempVar = require('ruffle_entrypoint').handleFileEmbed(${origVar});
            if (__tempVar !== undefined) {
                return __tempVar;
            }
            `;
        },
    }]
}];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            { ext: 'spacepack', id: 'spacepack' },
            'react'
        ],
        entrypoint: true
    },
};
