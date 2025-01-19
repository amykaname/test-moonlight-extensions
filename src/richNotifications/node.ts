import { ipcRenderer } from "electron";
import { MaxineIpcEvents } from "./shared";
import type { ToastOptions } from "./types";

export function sendNotification(notifId: number, data?: ConstructorParameters<typeof import("electron").Notification>[0], xmlOptions?: ToastOptions): Promise<void> {
    return ipcRenderer.invoke(MaxineIpcEvents.SEND_NOTIFICATON, notifId, data, xmlOptions);
}

export function closeNotification(notifId: number): Promise<void> {
    return ipcRenderer.invoke(MaxineIpcEvents.CLOSE_NOTIFICATION, notifId);
}

export function on(event: string, listener: (...args: any[]) => void): void {
    ipcRenderer.on(event, (event, ...args) => listener(...args));
}