import { createHash } from "node:crypto";
import { app, ipcMain, Notification } from "electron";
import { constants as FsConstants, mkdirSync } from "node:fs";
import { access, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ToastOptions } from "./types.js";
import { toXmlString } from "./node-powertoast/xml.js";
import { MaxineIpcEvents } from "./shared.js";

const notifs = new Map<number, Notification>();

console.log(app.getPath("userData"));
const imageCacheDir = path.join(app.getPath("userData"), "maxine-image-cache");
mkdirSync(imageCacheDir, { recursive: true });

async function exists(path: string) {
    return await access(path, FsConstants.F_OK)
        .then(() => true)
        .catch(() => false);
}

async function cacheIcon(icon: string): Promise<string> {
    const hash = createHash("md5").update(icon).digest("base64url");
    const extname = new URL(icon).pathname.match(/\.(png|gif|jpe?g|webp)/g)?.[1];

    const file = path.join(imageCacheDir, `${hash}.${extname}`);
    if (!await exists(file)) {
        await writeFile(file, Buffer.from(await fetch(icon).then(e => e.arrayBuffer())));
    }

    setTimeout(async () => {
        await unlink(file);
    }, 15_000);

    return path.resolve(file);
}

ipcMain.handle(MaxineIpcEvents.SEND_NOTIFICATON, async (event, notifId: number, data?: ConstructorParameters<typeof import("electron").Notification>[0], xmlOptions?: ToastOptions) => {
    const promises: Promise<any>[] = [];

    if (xmlOptions?.icon?.startsWith("http")) {
        promises.push(cacheIcon(xmlOptions.icon).then(e => { xmlOptions.icon = e; }));
    }
    if (xmlOptions?.heroImg?.startsWith("http")) {
        promises.push(cacheIcon(xmlOptions.heroImg).then(e => { xmlOptions.heroImg = e; }));
    }
    if (xmlOptions?.inlineImg?.startsWith("http")) {
        promises.push(cacheIcon(xmlOptions.inlineImg).then(e => { xmlOptions.inlineImg = e; }));
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }

    const notif = new Notification(Object.assign({
        toastXml: xmlOptions ? toXmlString(xmlOptions) : undefined
    } satisfies ConstructorParameters<typeof import("electron").Notification>[0], data));

    notifs.set(notifId, notif);

    notif.on("failed", () => {
        event.sender.send(MaxineIpcEvents.NOTIFICATON_FAILED, notifId);
    });

    notif.on("click", () => {
        event.sender.send(MaxineIpcEvents.NOTIFICATON_CLICK, notifId);
    });

    notif.on("close", () => {
        event.sender.send(MaxineIpcEvents.NOTIFICATON_CLOSE, notifId);
        notifs.delete(notifId);
    });

    notif.show();
});

ipcMain.handle(MaxineIpcEvents.CLOSE_NOTIFICATION, async (event, notifId: number) => {
    notifs.get(notifId)?.close();
});
