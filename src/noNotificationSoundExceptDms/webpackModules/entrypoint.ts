import { UserStore, GuildMemberStore, ChannelStore, MessageStore, GuildStore } from "@moonlight-mod/wp/common_stores";

const logger = moonlight.getLogger("noNotificationSoundExceptDms/entrypoint");
logger.info('Hello from noNotificationSoundExceptDms/entrypoint!');

export function interceptShowNotification(notificationModule: any, ...args: any[]) {
    logger.info('interceptShowNotification', args);

    // icon: n, title: i, body: e, trackingProps: l, options: o
    // n, i, e, l, o
    const [icon, title, body, trackingProps, options] = args;
    if (trackingProps.notif_type === 'MESSAGE_CREATE' && trackingProps.guild_id !== null) {
        options.volume = 0;
    }

    return notificationModule.showNotification(...args);
}