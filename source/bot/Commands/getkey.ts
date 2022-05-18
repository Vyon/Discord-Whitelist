import superagent from "superagent";

let command = {
	Name: "getkey",
	Args: 1,
	Execute: async (message: any, args: any[]) => {
		if (message.guild) {
			await message.reply("This command can only be used in a DM.")
			return;
		}
		
		const { author } = message;

		const discord_id = args[0];

		try {
			const response = await superagent.get("http://localhost:3000/api/v1/get-key").set("DiscordId", discord_id || author.id);

			message.reply(`||${response.text}||`);
		} catch {
			message.reply("Failed to get whitelist key.");
		}
	}
}

export = command