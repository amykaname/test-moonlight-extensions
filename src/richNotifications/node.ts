import { ipcRenderer, type IpcRendererEvent } from "electron";
import { MaxineIpcEvents } from "./shared";
import type { ToastOptions } from "./types";

export function sendNotification(notifId: number, data?: ConstructorParameters<typeof import("electron").Notification>[0], xmlOptions?: ToastOptions): Promise<void> {
    return ipcRenderer.invoke(MaxineIpcEvents.SEND_NOTIFICATON, notifId, data, xmlOptions);
}

export function closeNotification(notifId: number): Promise<void> {
    return ipcRenderer.invoke(MaxineIpcEvents.CLOSE_NOTIFICATION, notifId);
}

export function on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    ipcRenderer.on(channel, (event, ...args) => {
        console.log('richNotifications calling', channel, event, ...args);
        listener(event, ...args);
    });
}