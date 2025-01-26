/*!
https://github.com/lacymorrow/react-ruffle/blob/main/LICENSE

MIT License

Copyright (c) 2023 Lacy Morrow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import React, { useEffect, useRef } from "@moonlight-mod/wp/react";
import type { RuffleConfig, RuffleProps } from "./ruffle-types";
import type { PublicAPI } from "@ruffle/public/setup";
import type { PlayerV1 } from "@ruffle/public/player";

let maxIframeId = 0;

// Load Ruffle library
const ruffleLoadedPromise = new Promise<void>((resolve, reject) => {
    // Create script tag with Ruffle library
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@ruffle-rs/ruffle";
    script.async = true;

    script.onload = () => {
        resolve();
    };
    script.onerror = () => {
        reject();
    };
    
    // Add script tag to body
    document.body.appendChild(script);
});

export const Ruffle = ({ src, config, children, width, height, ...rest }: RuffleProps) => {
    // Default Configuration values for Ruffle
    // See values in the Ruffle docs: https://ruffle.rs/js-docs/master/interfaces/BaseLoadOptions.html

    const defaultConfig: RuffleConfig = {};

    // Merge default config with user config
    const mergedConfig = { ...defaultConfig, ...config };

    const ref = useRef<HTMLIFrameElement>(null);

    let rufflePlayer: PlayerV1;

    useEffect(() => {
        window.RufflePlayer = window.RufflePlayer || {};
        window.RufflePlayer.config = mergedConfig;

        const frameDocument = ref.current!.contentWindow!.document;

        const style = frameDocument.createElement('style');
        style.append(` 
            body {
                margin: 0;
                overflow: hidden;
            }
        `);

        frameDocument.head.append(style);

        const ruffle = (window.RufflePlayer as PublicAPI)!.newest()!;
        const player = ruffle.createPlayer();
        const container = frameDocument.createElement('div');
        frameDocument.body.append(container);
        container.appendChild(player);
        rufflePlayer = player.ruffle();
        rufflePlayer.load(src);

        return () => {
            rufflePlayer?.suspend(); // note: we can't destroy the player, but ruffle WILL clean up by itself, see "Ruffle instance destroyed" in console.
            container.remove();
        };
    }, [ref]);

    const iframeId = maxIframeId++;

    return (
        <>
            <style>{`
            .maxine-iframe-${iframeId} {
                width: ${width ?? 550}px;
                height: ${height ?? 400}px;
                border: none;
            }
        `}</style>
            <iframe title="Ruffle Iframe" className={`maxine-iframe-${iframeId}`} ref={ref}>
            </iframe>
        </>
    );
};

export const Flash = Ruffle;

export default Ruffle;