import { UserStore, GuildMemberStore, ChannelStore, MessageStore, GuildStore } from "@moonlight-mod/wp/common_stores";

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
const timestampRegex = /<t:(-?\d{1,13})(:([DFRTdft]))?>/g;
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

// @ts-expect-error intentional
window.Maxine ??= {};

window.Maxine.hydrateNotification = async (self: NotificationExBase, currentNotificationData: CurrentNotificationData, title: string, options?: NotificationOptions) => { 
    const notif = currentNotificationData?.data?.tag === options?.tag ? currentNotificationData : undefined;

    logger.info("Notification created, hydrating", self.id, notif);

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

    natives.sendNotification(self.id, undefined, {
        title: title,
        icon: options?.icon?.replace(/\.webp/, ".png"),
        message: content,
        attribution: "from Discord",
        uniqueID: options?.tag,
        silent: true,
        sequenceNumber: self.id,
    }).then(() => self.onshow());

    // fallback?
    setTimeout(() => self.close(), 10000);
}