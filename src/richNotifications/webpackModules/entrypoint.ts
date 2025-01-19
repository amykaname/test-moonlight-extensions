import { greeting } from "@moonlight-mod/wp/richNotifications_someLibrary";

const logger = moonlight.getLogger("richNotifications/entrypoint");
logger.info("Hello from entrypoint!");
logger.info("someLibrary exports:", greeting);

const natives = moonlight.getNatives("richNotifications");
logger.info("node exports:", natives);
