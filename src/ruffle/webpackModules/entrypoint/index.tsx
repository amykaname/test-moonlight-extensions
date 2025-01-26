import React from "@moonlight-mod/wp/react";
import type { Props } from "./types";
import { Flash } from "./ruffle";
import type { AutoPlay, NetworkingAccessMode } from "@ruffle/public/config";

const logger = moonlight.getLogger("ruffle/entrypoint");

logger.info('Hello from ruffle/entrypoint!');

export function handleFileEmbed(props: Props) {
    if (props.item.contentType !== 'application/vnd.adobe.flash.movie') {
        return undefined;
    }

    return <Flash
        src={props.url}
        config={{
            // Ruffle configuration options
            autoplay: "off" as AutoPlay,
            allowNetworking: 'none' as NetworkingAccessMode,
            allowScriptAccess: false,
            showSwfDownload: true,
            favorFlash: false,
            base: 'https://this-is-unsafe.invalid/',
        }}
    />;
}