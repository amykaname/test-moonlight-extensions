// biome-ignore lint/style/useImportType: stfu ur wrong !!!
import React from "@moonlight-mod/wp/react";
import Flux from '@moonlight-mod/wp/discord/packages/flux';
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";

export function deselect() {
    iframe.style.visibility = 'hidden';
}

Dispatcher.subscribe('NOTIFICATION_CLICK', () => {
    deselect();
});

const logger = moonlight.getLogger("elementChat/entrypoint");
logger.info('Hello from elementChat/entrypoint!');

export function wrapSeparatorJsx(children: React.ReactNode) {
    return <div className="elementChatSeparator">
        {children}
        <ElementChatButton />
    </div>;
}

const iframe = document.createElement('iframe');

function ElementChatButton() {
    return <div style={{
        position: 'relative',
        margin: '0 0 8px',
        display: 'flex',
        justifyContent: 'center',
        width: 'var(--custom-guild-list-width)',
    }}>
        <div>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: TODO later */}
            <img
                style={{
                    objectFit: 'contain',
                    width: '48px',
                    cursor: 'pointer',
                }}
                onClick={() => { iframe.style.visibility = iframe.style.visibility === 'visible' ? 'hidden' : 'visible'; }}
                src="https://app.element.io/vector-icons/apple-touch-icon-180.5d60475.png"
                alt="element chat icon" />
        </div>
    </div>
}

iframe.src = 'https://app.element.io/';
iframe.style.position = 'absolute';
iframe.style.top = '0px';
iframe.style.left = 'var(--custom-guild-list-width)';
iframe.style.width = 'calc(100vw - var(--custom-guild-list-width))';
iframe.style.height = '100vh';
iframe.style.zIndex = '999';
iframe.style.overflow = 'visible';
iframe.style.visibility = 'hidden';
document.body.appendChild(iframe);