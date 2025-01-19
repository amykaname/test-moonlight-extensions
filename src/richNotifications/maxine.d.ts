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

interface NotificationExBase {
    id: number;
    title?: string;
    body?: NotificationOptions["body"];
    icon?: NotificationOptions["icon"];
    onshow: () => void;
    onclick: () => void;
    onclose: () => void;
    close(): void;
}

interface Window {
    Maxine: {
        Notification: typeof NotificationEx,

        hydrateNotification: (
            self: NotificationExBase,
            currentNotificationData: CurrentNotificationData,
            title: string,
            options?: NotificationOptions
        ) => Promise<void>,

        // e=image
        // t=user+server
        // n=contents
        handleShowNotification(
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
        ): void;
    }
}