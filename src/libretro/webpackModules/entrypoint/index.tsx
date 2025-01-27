import React, { useEffect, useRef, useState } from '@moonlight-mod/wp/react';
import type { Props } from './types';
import { toString as ui8ToString } from 'uint8arrays';

const logger = moonlight.getLogger('libretro/entrypoint');

logger.info('Hello from libretro/entrypoint!');

// https://stackoverflow.com/a/14919494
/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return `${bytes} bytes`;
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return `${bytes.toFixed(dp)} ${units[u]}`;
}

const supportedCores = {
    'genesis_plus_gx': ['.gen', '.md', '.smd', '.sms'],
    'mupen64plus_next': ['.n64', '.v64', '.z64', '.ndd'],
    'snes9x': ['.smc', '.sfc'],
    'fceumm': ['.nes', '.fds'],
    'stella2014': ['.a26'],
    'virtualjaguar': ['.jag', '.j64'],
    'vba_next': ['.gba'],
    'prboom': ['.wad'],
    'gearboy': ['.gb', '.gbc'],
    'melonds': ['.nds', '.dsi'],
    'mednafen_ngp': ['.ngp', '.ngc'],
    'mednafen_vb': ['.vb'],
};

const coreByExtension = Object.fromEntries(
    Object.entries(supportedCores)
        .flatMap(([core, exts]) => exts.map(ext => [ext, core]))
);

const supportedExtensions = Object.values(supportedCores).flat();

export function handleFileEmbed(props: Props) {
    if (!supportedExtensions.some(ext => props.fileName.toLowerCase().endsWith(ext))) {
        return undefined;
    }

    const [showing, setShowing] = useState(false);
    const [file, setFile] = useState<Uint8Array>();

    useEffect(() => {
        if (showing)
            fetch(props.url)
                .then(e => e.arrayBuffer())
                .then(buf => setFile(new Uint8Array(buf)));
    }, [showing]);

    const core = coreByExtension[Object.keys(coreByExtension).find(ext => props.fileName.toLowerCase().endsWith(ext))!];

    return showing && file ? (
        <iframe
            onLoad={event => {
                const iframe = event.currentTarget;
                iframe.contentWindow!.postMessage({
                    name: props.fileName,
                    core: core,
                    data: file
                }, '*');
            }}
            title="Libretro Frame"
            width="550"
            height="400"
            src="https://uwx.github.io/moonlight-libretro-backend/"
        />
    ) : (
        <button style={{ width: '550px', height: '400px', display: 'block', cursor: 'pointer' }} type="button" tabIndex={0} onClick={() => setShowing(true)}>
            <div style={{ position: 'absolute', left: '1rem', top: '1rem', textAlign: 'left' }}>
                <p>Click to load {props.fileName} ({humanFileSize(props.fileSize)}) with core {core}</p>
                <button
                    type="button"
                    onClick={event => {
                        event.stopPropagation();
                        window.open(props.url, '_blank');
                    }}
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #3893FC',
                        background: '#3AFCF6',
                        borderRadius: '6px',
                        marginTop: '0.5rem', 
                    }}
                >Download file</button>
            </div>
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
                            id="c"
                            gradientUnits="userSpaceOnUse"
                            x1="125"
                            y1="0"
                            x2="125"
                            y2="250"
                            spreadMethod="pad"
                        >
                            <stop xmlns="http://www.w3.org/2000/svg" offset="0%" stop-color="#3AFCF6" />
                            <stop xmlns="http://www.w3.org/2000/svg" offset="100%" stop-color="#3893FC" />
                        </linearGradient>
                        <g xmlns="http://www.w3.org/2000/svg" id="d">
                            <path
                                xmlns="http://www.w3.org/2000/svg"
                                fill="url(#c)"
                                d="M250 125q0-52-37-88-36-37-88-37T37 37Q0 73 0 125t37 88q36 37 88 37t88-37q37-36 37-88M87 195V55l100 70-100 70z"
                            />
                            <path
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#FFF"
                                d="M87 55v140l100-70L87 55z"
                            />
                        </g>
                    </defs>
                    <use xmlns="http://www.w3.org/2000/svg" href="#d" />
                </svg>
            </div>
        </button>
    );
}
