import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("elementChat");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: /className:\i\.guildSeparator/,
        replace: [{
            match: /\(0,\i\.jsx\)\(\i\.\i,{children:\(0,\i\.jsx\)\("div",{className:\i\.guildSeparator}\)}\)/,
            replacement: `(require("elementChat_entrypoint").wrapSeparatorJsx($&))`
        }]
    },
    {
        find: /let{pathname:\i="",state:\i}=\i;/,
        replace: [{
            match: /let \i=\i.useCallback\(\i=>{/,
            replacement: '$&require("elementChat_entrypoint").deselect();'
        }]
    }
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        entrypoint: true,
        dependencies: [
            { id: 'react' },
            { id: "discord/Dispatcher" },
            { id: "discord/packages/flux" },
        ]
    },
};
