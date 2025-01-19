declare type CurrentNotificationData = {
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
} | undefined;

type GuildMember = any;
type User = any;
type Guild = any;
type Message = any;
