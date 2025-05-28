import type { ExtensionWebExports } from "@moonlight-mod/types";

// extension will fail to load if this is not present
export const patches: ExtensionWebExports["patches"] = [
    {
        find: "shouldShowSpeakingWhileMutedTooltip",
        replace: {
            match: /className:\i\.buttons,.{0,50}children:\[/,
            replacement: "$&require('gameActivityToggle_entrypoint').GameActivityToggleButton(),"
        }
    }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            'react',
            {
                ext: 'spacepack',
                id: 'spacepack',
            },
            {
                ext: 'common',
                id: 'ErrorBoundary',
            }
        ],
    }
};