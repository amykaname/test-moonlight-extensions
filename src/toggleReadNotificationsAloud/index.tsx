import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("toggleReadNotificationsAloud");

// extension will fail to load if this is not present
export const patches: ExtensionWebExports["patches"] = [];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            '},setTTSType(',
            {
                ext: 'spacepack',
                id: 'spacepack',
            }
        ],
        entrypoint: true
    }
};