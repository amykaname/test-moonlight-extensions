import { spacepack } from '@moonlight-mod/wp/spacepack_spacepack';
import { NotificationSettingsStore } from '@moonlight-mod/wp/common_stores';

const logger = moonlight.getLogger("toggleReadNotificationsAloud/entrypoint");
logger.info('Hello from toggleReadNotificationsAloud/entrypoint!');

const DesktopSettingsModule = spacepack.findByCode(`},setT${''}TSType(`)[0]?.exports.default;

window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || (e.metaKey && navigator.platform.includes("Mac"))) && e.shiftKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const ttsType = NotificationSettingsStore.getTTSType();

        if (ttsType === 'SELECTED_CHANNEL') {
            DesktopSettingsModule.setTTSType('NEVER');
            logger.info(`Set TTS type to ${NotificationSettingsStore.getTTSType()}`);
        } else {
            DesktopSettingsModule.setTTSType('SELECTED_CHANNEL');
            logger.info(`Set TTS type to ${NotificationSettingsStore.getTTSType()}`);
        }
    }
}, { capture: true });