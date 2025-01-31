import type { BrowserWindow, OnHeadersReceivedListenerDetails } from "electron";

moonlightHost.events.on('headers-received', (details: OnHeadersReceivedListenerDetails, isMainWindow: boolean) => {
    if (new URL(details.url).hostname === 'app.element.io') {
        if (details.responseHeaders) {
            if(details.responseHeaders['X-Frame-Options']){
                delete details.responseHeaders['X-Frame-Options'];
            } else if(details.responseHeaders['x-frame-options']) {
                delete details.responseHeaders['x-frame-options'];
            }
        }
    }
})