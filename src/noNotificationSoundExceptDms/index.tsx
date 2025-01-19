import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("noNotificationSoundExceptDms");

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: /"displayName","NotificationStore"/g,
        replace: [{
            match: /(\w+\.\w+).showNotification\(/g,
            replacement: `
                require("noNotificationSoundExceptDms_entrypoint").interceptShowNotification($1, 
            `
        }]
    }
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        entrypoint: true
    },
};
