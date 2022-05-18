import superagent from "superagent";

let command = {
	Name: "whitelisted",
	Args: 1,
	Execute: async (message: any, args: any[]) => {
		const { author } = message;

		const discord_id = args[0];

		try {
			const response = await superagent.get("http://localhost:3000/api/v1/whitelist").set("DiscordId", discord_id || author.id);

			message.reply(response.text);
		} catch {
			message.reply("Failed to check whitelist.");
		}
	}
}

export = command;