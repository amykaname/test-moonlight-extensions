import React from "@moonlight-mod/wp/react";
import { MfmRenderer } from "./Mfm";
import ErrorBoundary from '@moonlight-mod/wp/common_ErrorBoundary';

const logger = moonlight.getLogger("mfm/entrypoint");

export function patchCodeBlock(codeBlock: { lang: string, content: string, inQuote: boolean, type: 'codeBlock' }, unknown: any, message: any) {
    if (codeBlock.type !== 'codeBlock') {
        return;
    }

    if (codeBlock.lang !== 'mfm') {
        return;
    }

    return <ErrorBoundary><MfmRenderer text={codeBlock.content} /></ErrorBoundary>;
}