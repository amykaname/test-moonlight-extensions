import type { ExtensionWebExports } from "@moonlight-mod/types";

// extension will fail to load if this is not present
export const patches: ExtensionWebExports["patches"] = [
    {
        find: ",updateSetting:",
        replace: [
            // Main setting definition
            {
                match: /(?<=INFREQUENT_USER_ACTION.{0,20},)useSetting:/,
                replacement: "userSettingsAPIGroup:arguments[0],userSettingsAPIName:arguments[1],$&"
            },
            // Selective wrapper
            {
                match: /updateSetting:.{0,100}SELECTIVELY_SYNCED_USER_SETTINGS_UPDATE/,
                replacement: "userSettingsAPIGroup:arguments[0].userSettingsAPIGroup,userSettingsAPIName:arguments[0].userSettingsAPIName,$&"
            },
            // Override wrapper
            {
                match: /updateSetting:.{0,60}USER_SETTINGS_OVERRIDE_CLEAR/,
                replacement: "userSettingsAPIGroup:arguments[0].userSettingsAPIGroup,userSettingsAPIName:arguments[0].userSettingsAPIName,$&"
            }
        ]
    }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
    api: {
        dependencies: [
            '"textAndImages","renderSpoilers"',
            {
                ext: 'spacepack',
                id: 'spacepack',
            }
        ],
    }
};