import type { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
    {
        find: /window\.Notification/g,
        replace: [{
            match: /window\.Notification/g,
            replacement: 'Maxine?.Notification'
        }, {
            match: /showNotification(?::function)?\((.*?)\){/,
            replacement: "showNotification:function($1){" +
                "let __temp = Maxine?.handleShowNotification($1);" +
                "if (typeof __temp !== 'undefined') return __temp;",
        }]
    }
];

import { UserStore, GuildMemberStore, ChannelStore, MessageStore, GuildStore } from "@moonlight-mod/wp/common_stores";
import { MaxineIpcEvents } from "./shared";

const logger = moonlight.getLogger("richNotifications/entrypoint");
logger.info("Hello from entrypoint!");

const natives: typeof import('./node') = moonlight.getNatives("richNotifications");

let currentNotificationData: {
    icon: string,
    title: string,
    body: string,
    source: {
        channel_id: string,
        channel_type: number,
        guild_id: string | null,
        message_id: string,
        message_type: number,
        notif_type: string,
        notif_user_id: string,
    },
    data: {
        omitViewTracking: boolean,
        onClick: () => void,
        onShown: () => any,
        sound: unknown | null,
        soundpack: undefined,
        tag: string,
        volume: number,
        overrideStreamerMode?: boolean,
        playSoundIfDisabled?: boolean,
        omitClickTracking?: boolean,
    };
} | undefined = undefined;

natives.on(MaxineIpcEvents.NOTIFICATON_CLICK, (event, id: number) => {
    notifs.get(id)?.onclick();
});

natives.on(MaxineIpcEvents.NOTIFICATON_CLOSE, (event, id: number) => {
    notifs.get(id)?.onclose();
    notifs.delete(id);
});

type GuildMember = any;
type User = any;
type Guild = any;
type Message = any;

const notifs = new Map<number, NotificationEx>();

const userRegex = /<@!?(\d+)>/g;
const roleRegex = /<@&(\d+)>/g;
const channelRegex = /<#(\d+)>/g;
const emojiRegex = /<a?:([a-zA-Z0-9_]+):(\d+)>/g;
const timestampRegex = /<t:(-?\d{1,13})(:([DFRTdft]))?>/g;
const spoilerRegex = /\|\|(.*?)\|\|/gs;

function getDisplayName(user: GuildMember | User): string {
    return (user as any)?.globalName;
}

function cleanContent(content: string, guild?: Guild) {
    return content
        .replace(spoilerRegex, ($$, $1) => "\u2B1B".repeat($1.length))
        .replace(userRegex, ($$, $1) => `@${guild != null && GuildMemberStore.getNick(guild.id, $1) || getDisplayName(UserStore.getUser($1))}`)
        .replace(channelRegex, ($$, $1) => `#${ChannelStore.getChannel($1)?.name}`)
        .replace(emojiRegex, ($$, $1) => `:${$1}:`)
        .replace(roleRegex, ($$, $1) => `@${guild?.getRole($1)?.name ?? "unknown-role"}`)
        .replace(/^.{129,}$/, $$ => $$.slice(0, 125) + "...");
}

let _id = 0;
class NotificationEx {
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

        const notif = currentNotificationData?.data?.tag === options?.tag ? currentNotificationData : undefined;

        logger.info("Notification created", this.id, notif);

        let message: Message | undefined = undefined;
        if (notif) {
            message = MessageStore.getMessage(notif.source.channel_id, notif.source.message_id);
        }

        let guild: Guild | undefined = undefined;
        if (notif?.source.guild_id) {
            guild = GuildStore.getGuild(notif.source.guild_id);
        }

        let content = options?.body;
        if (message) {
            content = cleanContent(message?.content, guild);
        }

        natives.sendNotification(this.id, undefined, {
            title: title,
            icon: options?.icon?.replace(/\.webp/, ".png"),
            message: content,
            attribution: "from Discord",
            uniqueID: options?.tag,
            silent: true,
            sequenceNumber: this.id,
        }).then(() => this.onshow());

        // fallback?
        setTimeout(() => this.close(), 10000);
    }
}

declare global {
    interface Window {
        Maxine: {
            Notification: typeof NotificationEx,

            handleShowNotification(e: string, t: string, n: string, i: {
                channel_id: string,
                channel_type: number,
                guild_id: string | null,
                message_id: string,
                message_type: number,
                notif_type: string,
                notif_user_id: string,
            }, l: {
                omitViewTracking: boolean,
                onClick: () => void,
                onShown: () => any,
                sound: unknown | null,
                soundpack: undefined,
                tag: string,
                volume: number,
                overrideStreamerMode?: boolean,
                playSoundIfDisabled?: boolean,
                omitClickTracking?: boolean,
            }): void;
        }
    }
}

window.Maxine = {
    Notification: NotificationEx,

    // e=image
    // t=user+server
    // n=contents
    handleShowNotification(e: string, t: string, n: string, i: {
        channel_id: string,
        channel_type: number,
        guild_id: string | null,
        message_id: string,
        message_type: number,
        notif_type: string,
        notif_user_id: string,
    }, l: {
        omitViewTracking: boolean,
        onClick: () => void,
        onShown: () => any,
        sound: unknown | null,
        soundpack: undefined,
        tag: string,
        volume: number,
        overrideStreamerMode?: boolean,
        playSoundIfDisabled?: boolean,
        omitClickTracking?: boolean,
    }) {
        currentNotificationData = {
            icon: e,
            title: t,
            body: n,
            source: i,
            data: l
        };
    }
};


// // https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
// export const webpackModules: ExtensionWebExports["webpackModules"] = {
//     entrypoint: {
//         entrypoint: true
//     },
// };
