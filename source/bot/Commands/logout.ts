import superagent from "superagent";

let command = {
	Name: "logout",
	Args: 0,
	Execute: async (message: any) => {
		// I have this disabled because I don't want people creating infinite accounts.
		return;

		const { author } = message;
		const discord_id = author.id;

		try {
			const response = await superagent.post("http://localhost:3000/api/v1/user/logout").send({
				DiscordId: discord_id
			});

			message.reply(response.text);
		} catch {
			message.reply("Failed to logout.");
		}
	}
}

export = command;