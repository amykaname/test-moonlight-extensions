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
    },
    {
        find: /"displayName","NotificationStore"/g,
        replace: [{
            match: /MESSAGE_CREATE:function\((\w+)\){/g,
            replacement: `
                MESSAGE_CREATE: function($1) {
                    require("richNotifications_entrypoint").interceptMessageCreate($1);
            `
        }, {
            match: /message_id:(\w+).id,message_type:\1.type,channel_id:(\w+).id,channel_type:\2.type,/,
            replacement: `
                message_id: $1.id,
                message_type: $1.type,
                channel_id: $2.id,
                channel_type: $2.type,
                ___MaxineMessage: $1,
                ___MaxineChannel: $2,` 
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
