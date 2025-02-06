import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("toggleReadNotificationsAloud");

// extension will fail to load if this is not present
export const patches: ExtensionWebExports["patches"] = [
    {
        find: "shouldShowSpeakingWhileMutedTooltip",
        replace: {
            match: /this\.renderNameZone\(\).+?children:\[/,
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
                ext: 'userSettingsApi',
                id: 'api',
            },
            {
                ext: 'common',
                id: 'ErrorBoundary',
            }
        ],
    }
};