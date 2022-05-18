import superagent from "superagent";

let command = {
	Name: "signup",
	Args: 1,
	Execute: async function(message: any, args: any[]) {
		if (message.guild) {
			await message.reply("This command can only be used in a DM.");
			return;
		}

		if (args[1].length < 8) {
			await message.reply("Your password must be at least 8 characters long!");
			return;
		}

		try {
			const response = await superagent.post("http://localhost:3000/api/v1/user/create").send({
				Username: args[0],
				Password: args[1]
			})

			message.reply(response.text);
		} catch {
			await message.reply("Failed to signup.");
		}
	}
}

export = command