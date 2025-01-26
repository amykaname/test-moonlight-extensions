import React, { useEffect, useRef, useState } from '@moonlight-mod/wp/react';
import type { Props } from './types';
import { toString as ui8ToString } from 'uint8arrays';

const logger = moonlight.getLogger('ruffle/entrypoint');

logger.info('Hello from ruffle/entrypoint!');

export function handleFileEmbed(props: Props) {
    if (props.item.contentType !== 'application/vnd.adobe.flash.movie') {
        return undefined;
    }

    const [showing, setShowing] = useState(false);
    const [swf, setSwf] = useState<Uint8Array>();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (showing)
            fetch(props.url)
                .then(e => e.arrayBuffer())
                .then(buf => setSwf(new Uint8Array(buf)));
    }, [showing]);

    useEffect(() => {
        logger.info('sending message to iframe');
        if (iframeRef.current && swf) {
            iframeRef.current.contentWindow!.postMessage({
                type: 'swf',
                data: swf
            }, '*');
        }
    }, [iframeRef.current]);

    return showing && swf ? (
        <iframe
            ref={iframeRef}
            title="Ruffle Frame"
            width="550"
            height="400"
            src="https://uwx.github.io/moonlight-ruffle-player-backend/"
        />
    ) : (
        <button style={{ width: '550px', height: '400px', display: 'block', cursor: 'pointer' }} type="button" tabIndex={0} onClick={() => setShowing(true)}>
            <div style={{
                height: '50%',
                left: '50%',
                maxHeight: '384px',
                maxWidth: '384px',
                opacity: '.8', // TODO hover: opacity 1
                position: 'absolute',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
            }}>
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 250 250"
                    width="100%"
                    height="100%"
                >
                    <defs xmlns="http://www.w3.org/2000/svg">
                        <linearGradient
                            xmlns="http://www.w3.org/2000/svg"
                            id="a"
                            gradientUnits="userSpaceOnUse"
                            x1="125"
                            y1="0"
                            x2="125"
                            y2="250"
                            spreadMethod="pad"
                        >
                            <stop xmlns="http://www.w3.org/2000/svg" offset="0%" stop-color="#FDA138" />
                            <stop xmlns="http://www.w3.org/2000/svg" offset="100%" stop-color="#FD3A40" />
                        </linearGradient>
                        <g xmlns="http://www.w3.org/2000/svg" id="b">
                            <path
                                xmlns="http://www.w3.org/2000/svg"
                                fill="url(#a)"
                                d="M250 125q0-52-37-88-36-37-88-37T37 37Q0 73 0 125t37 88q36 37 88 37t88-37q37-36 37-88M87 195V55l100 70-100 70z"
                            />
                            <path
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#FFF"
                                d="M87 55v140l100-70L87 55z"
                            />
                        </g>
                    </defs>
                    <use xmlns="http://www.w3.org/2000/svg" href="#b" />
                </svg>
            </div>
        </button>
    );
}
