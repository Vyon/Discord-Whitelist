import superagent from "superagent";

let command = {
	Name: "whitelist",
	Args: 1,
	Execute: async (message: any, args: any[]) => {
		const { author } = message;

		const discord_id = args[0];

		try {
			const response = await superagent.post("http://localhost:3000/api/v1/whitelist").send({
				DiscordId: discord_id || author.id
			});

			message.reply(response.text || "An error has occurred please try again later.");
		} catch {
			message.reply("Failed to whitelist user.");
		}
	}
}

export = command