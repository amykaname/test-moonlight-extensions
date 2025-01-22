import { Culture, recognizeDateTime } from "@microsoft/recognizers-text-date-time";
import { CommandType, InputType, OptionType } from "@moonlight-mod/types/coreExtensions/commands";
import Commands from "@moonlight-mod/wp/commands_commands";

const logger = moonlight.getLogger("sendTimestamps/entrypoint");

logger.info('Hello from sendTimestamps/entrypoint!');

Commands.registerCommand({
    id: "time",
    description: "Sends a date and time in natural language formatted as a timestamp",
    inputType: InputType.BUILT_IN_TEXT,
    type: CommandType.CHAT,
    options: [{
        name: 'date-and-time',
        description: 'The date and/or time to send',
        type: OptionType.STRING,
    }], // TODO add options for other formats
    execute: (options) => {
        const dateAndTime = options[0].value as string;
        
        // TODO allow end-user to choose culture
        const results = recognizeDateTime(dateAndTime, Culture.English);
        logger.info(results);
        return {
            // TODO replace inline in string instead
            content: results.map(result => formatDate(new Date(result.resolution.values[0].value), 'relative')).join(' '),
        }

        function formatDate(date: Date, kind: string) {
            const unixSeconds = Math.floor(date.getTime() / 1000);

            switch (kind) {
                case 'shortdate': return `<t:${unixSeconds}:d>`;
                case 'longdate': return `<t:${unixSeconds}:D>`;
                case 'longdateshorttime': return `<t:${unixSeconds}:f>`;
                case 'full': return `<t:${unixSeconds}:F>`;
                case 'shorttime': return `<t:${unixSeconds}:t>`;
                case 'longtime': return `<t:${unixSeconds}:T>`;
                case 'relative': return `<t:${unixSeconds}:R>`;
                default: return `<t:${unixSeconds}:R>`;
            }
        }
    }
})
