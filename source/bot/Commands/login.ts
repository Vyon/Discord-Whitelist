import superagent from "superagent";

let command = {
	Name: "login",
	Args: 1,
	Execute: async (message: any, args: any[]) => {
		if (message.guild) {
			await message.reply("This command can only be used in a DM.")
			return;
		}

		const { author } = message;

		const username = args[0];
		const password = args[1];
		const discord_id = author.id;

		if (!username || !password) {
			await message.reply("Please provide a username and password.");
			return;
		}

		try {
			const response = await superagent.post("http://localhost:3000/api/v1/user/login").send({
				Username: username,
				Password: password,
				DiscordId: discord_id
			})

			message.reply(response.text);
		} catch {
			message.reply("Failed to login.");
		}
	}
}

export = command;