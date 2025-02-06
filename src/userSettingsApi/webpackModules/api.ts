import { spacepack } from '@moonlight-mod/wp/spacepack_spacepack';

interface UserSettingDefinition<T> {
    /**
     * Get the setting value
     */
    getSetting(): T;
    /**
     * Update the setting value
     * @param value The new value
     */
    updateSetting(value: T): Promise<void>;
    /**
     * Update the setting value
     * @param value A callback that accepts the old value as the first argument, and returns the new value
     */
    updateSetting(value: (old: T) => T): Promise<void>;
    /**
     * Stateful React hook for this setting value
     */
    useSetting(): T;
    userSettingsAPIGroup: string;
    userSettingsAPIName: string;
}

export const UserSettings: Record<PropertyKey, UserSettingDefinition<any>> | undefined = spacepack.findByCode(`"textAndImages"${''},"renderSpoilers"`)[0].exports;

/**
 * Get the setting with the given setting group and name.
 *
 * @param group The setting group
 * @param name The name of the setting
 */
export function getUserSetting<T = any>(group: string, name: string): UserSettingDefinition<T> | undefined {
    for (const key in UserSettings) {
        const userSetting = UserSettings[key];

        if (userSetting.userSettingsAPIGroup === group && userSetting.userSettingsAPIName === name) {
            return userSetting;
        }
    }
}
