import type { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: /window\.Notification/g,
        replace: [{
            match: /window\.Notification/g,
            replacement: 'require("richNotifications_entrypoint").NotificationEx'
        }, {
            match: /showNotification:(\w+)/,
            replacement: `showNotification: function(...args) {
                let result = require("richNotifications_entrypoint").handleShowNotification(...args);
                if (typeof result !== 'undefined') return result;

                return ($1).apply(this, args);
            }`,
        }]
    }
];

import { MaxineIpcEvents } from "./shared";

const logger = moonlight.getLogger("richNotifications");

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            { ext: "common", id: "stores" },
        ],
        entrypoint: true
    },
};
