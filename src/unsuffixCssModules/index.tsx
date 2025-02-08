import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("unsuffixCssModules");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: /__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED\.ReactCurrentOwner/g,
        replace: [{
            match: /(\i).jsx=(\i)/,
            replacement: '$1.jsx = (...args) => require("unsuffixCssModules_entrypoint").jsx($2, args)',
        }, {
            match: /(\i).jsxs=(\i)/,
            replacement: '$1.jsxs = (...args) => require("unsuffixCssModules_entrypoint").jsx($2, args)',
        }]
    }
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        entrypoint: true,
        dependencies: [
            { id: 'react' },
            { ext: 'common', id: 'ErrorBoundary' },
        ]
    },
};
