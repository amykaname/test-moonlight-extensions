import type { ExtensionWebExports } from "@moonlight-mod/types";

const logger = moonlight.getLogger("pauseTts");

window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || (e.metaKey && navigator.platform.includes("Mac"))) && (e.key === "b" || e.key === "B")) {
        if (speechSynthesis.paused) {
            logger.info('TTS is paused, resuming');
            speechSynthesis.resume();
        } else {
            logger.info('TTS is resumed, pausing');
            speechSynthesis.pause();
        }
    }
}, { capture: true });

// extension will fail to load if this is not present
export const patches: ExtensionWebExports["patches"] = [];