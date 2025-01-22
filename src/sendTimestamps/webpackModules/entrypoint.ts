import { Culture, recognizeDateTime } from "@microsoft/recognizers-text-date-time";
import Commands from "@moonlight-mod/wp/commands_commands";

const logger = moonlight.getLogger("sendTimestamps/entrypoint");

logger.info('Hello from sendTimestamps/entrypoint!');

Commands.registerLegacyCommand("uwx-sendTimestamps", {
  // This can be a more specific regex, but this only tells it to run if it
  // finds anything that matches this regex within the message.
  // You will have to do your own extraction and processing if you want to do
  // something based on a specific string.
  match: /^\s*\.time(shortdate|longdate|longdateshorttime|full|shorttime|longtime|relative)?\s+(.+)/,
  action: (content, context) => {
	const match = content.match(/^\s*\.time(shortdate|longdate|longdateshorttime|full|shorttime|longtime|relative)?\s+(.+)/);

	if (match) {
		const kind = match[1] || 'relative';
		const parameters = match[2];

		// TODO allow end-user to choose culture
		const results = recognizeDateTime(parameters, Culture.English);
		logger.info(results);
		return {
			// TODO replace inline in string instead
			content: results.map(result => formatDate(new Date(result.resolution.values[0].value), kind)).join(' '),
		}
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

    return {content};
  }
})