import { UserStore, GuildMemberStore, ChannelStore, MessageStore, GuildStore } from "@moonlight-mod/wp/common_stores";
import { MaxineIpcEvents } from "richNotifications/shared";

const natives: typeof import('../node') = moonlight.getNatives("richNotifications");

const logger = moonlight.getLogger("richNotifications/entrypoint");
logger.info('Hello from entrypoint!');

function getDisplayName(user: GuildMember | User): string {
    return (user as any)?.globalName;
}

const userRegex = /<@!?(\d+)>/g;
const roleRegex = /<@&(\d+)>/g;
const channelRegex = /<#(\d+)>/g;
const emojiRegex = /<a?:([a-zA-Z0-9_]+):(\d+)>/g;
const timestampRegex = /<t:(-?\d{1,13})(:([DFRTdft]))?>/g; // TODO unused
const spoilerRegex = /\|\|(.*?)\|\|/gs;

function cleanContent(content: string, guild?: Guild) {
    return content
        .replace(spoilerRegex, ($$, $1) => "\u2B1B".repeat($1.length))
        .replace(userRegex, ($$, $1) => `@${guild != null && GuildMemberStore.getNick(guild.id, $1) || getDisplayName(UserStore.getUser($1))}`)
        .replace(channelRegex, ($$, $1) => `#${ChannelStore.getChannel($1)?.name}`)
        .replace(emojiRegex, ($$, $1) => `:${$1}:`)
        .replace(roleRegex, ($$, $1) => `@${guild?.getRole($1)?.name ?? "unknown-role"}`)
        .replace(/^.{129,}$/, $$ => `${$$.slice(0, 125)}...`);
}

let currentNotificationData: CurrentNotificationData = undefined;
let currentFluxMessage: { message: Message, channelId: string, guildId: string } | undefined = undefined;

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
export class NotificationEx {
    public id: number;
    public title?: string;
    public body?: NotificationOptions["body"];
    public icon?: NotificationOptions["icon"];
    public onshow = () => { };
    public onclick = () => { };
    public onclose = () => { };

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

        try {
            const notif = currentNotificationData?.data?.tag === options?.tag ? currentNotificationData : undefined;

            logger.info("Notification created, hydrating", this.id, notif);

            let message: Message | undefined = undefined;
            let channel: Channel | undefined = undefined;
            if (notif) {
                message = MessageStore.getMessage(notif.source.channel_id, notif.source.message_id);
                channel = ChannelStore.getChannel(notif.source.channel_id);
            }
            
            if (!message) {
                message = currentFluxMessage?.message;
            }
        
            let guild: Guild | undefined = undefined;
            if (notif?.source.guild_id) {
                guild = GuildStore.getGuild(notif.source.guild_id);
            }
        
            let attachment: string | undefined = undefined;

            let content = options?.body;
            if (message) {
                content = cleanContent(message?.content, guild);

                if (message.attachments.length > 0 &&
                    message.attachments[0].content_type.startsWith('image/') &&
                    !message.attachments[0].filename.startsWith('SPOILER_') &&
                    (!channel || !channel.nsfw)) {
                    attachment = message.attachments[0].proxy_url;
                }
            }

            logger.info('DEBUG:', message, guild, channel);
        
            natives.sendNotification(this.id, undefined, {
                title: title,
                icon: options?.icon?.replace(/\.webp/, ".png"),
                cropIcon: true,
                message: content,
                attribution: "from Discord",
                uniqueID: options?.tag,
                silent: true,
                sequenceNumber: this.id,
                inlineImg: attachment,
            }).then(() => this.onshow());

            // fallback?
            setTimeout(() => this.close(), 10000);
        } catch (err) {
            logger.error("Failed to hydrate notification", err);
        }
    }
}

// e=image
// t=user+server
// n=contents
export function handleShowNotification(
    e: string,
    t: string,
    n: string,
    i: {
        channel_id: string,
        channel_type: number,
        guild_id: string | null,
        message_id: string,
        message_type: number,
        notif_type: string,
        notif_user_id: string,
    },
    l: {
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
    }
) {
    logger.info('handleShowNotification', e, t, n, i, l);

    currentNotificationData = {
        icon: e,
        title: t,
        body: n,
        source: i,
        data: l
    };
};

export function interceptMessageCreate(event: any) {
    // logger.info('interceptMessageCreate', event);
    currentFluxMessage = event;
}