import type { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: /window\.Notification/g,
        replace: [{
            match: /window\.Notification/g,
            replacement: 'Maxine?.Notification'
        }, {
            match: /showNotification:(\w+)/,
            replacement: `showNotification: function(...args) {
                let result = Maxine?.handleShowNotification(...args);
                if (typeof result !== 'undefined') return result;

                return ($1).apply(this, args);
            }`,
        }]
    }
];

import { MaxineIpcEvents } from "./shared";

const logger = moonlight.getLogger("richNotifications");

const natives: typeof import('./node') = moonlight.getNatives("richNotifications");

let currentNotificationData: CurrentNotificationData = undefined;

natives.on(MaxineIpcEvents.NOTIFICATON_CLICK, (event, id: number) => {
    logger.info(`Clicked notification ${id}`);
    notifs.get(id)?.onclick();
});

natives.on(MaxineIpcEvents.NOTIFICATON_CLOSE, (event, id: number) => {
    logger.info(`Closed notification ${id}`);
    notifs.get(id)?.onclose();
    notifs.delete(id);
});

const notifs = new Map<number, NotificationEx>();

let _id = 0;
class NotificationEx implements NotificationExBase {
    public id: number;
    public title?: string;
    public body?: NotificationOptions["body"];
    public icon?: NotificationOptions["icon"];
    public onshow = function () { };
    public onclick = function () { };
    public onclose = function () { };

    static permission = "granted";

    static __orig = window.Notification;

    static requestPermission(callback: () => any) {
        callback();
    }

    close() {
        natives.closeNotification(this.id).then(() => this.onclose());
        notifs.delete(this.id);
    }

    constructor(title: string, options?: NotificationOptions) {
        this.id = _id++;

        this.title = title;
        this.body = options?.body;
        this.icon = options?.icon;

        notifs.set(this.id, this);

        this.hydrateNotification(title, options);
    }
    async hydrateNotification(title: string, options: NotificationOptions | undefined) {
        try {
            await window.Maxine.hydrateNotification(this, currentNotificationData, title, options);
        } catch (err) {
            logger.error("Failed to hydrate notification", err);
        }
    }
}

// @ts-expect-error intentional
window.Maxine ??= {};

window.Maxine.Notification = NotificationEx;

// e=image
// t=user+server
// n=contents
window.Maxine.handleShowNotification = (e, t, n, i, l) => {
    logger.debug('handleShowNotification', e, t, n, i, l);

    currentNotificationData = {
        icon: e,
        title: t,
        body: n,
        source: i,
        data: l
    };
};


// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            { ext: "common", id: "stores" },
        ],
        entrypoint: true
    },
};
