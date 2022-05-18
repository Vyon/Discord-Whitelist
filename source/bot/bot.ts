import * as config from "../config.json";
import { Client, Intents } from "discord.js";
import { GetDirectoryFiles } from "./file";

export class Bot {
	private _Client: any;
	private _Token: string = "";
	private _StartTime: number = 0;
	private _Commands: any = {};

	constructor(token: string | undefined, settings: any) {
		// Make sure token exists
		if (!token) {
			console.log("Failed to start bot, No token provided");
			return;
		}

		// Assign Properties
		this._Token = token
		this._StartTime = Date.now();
		this._Client = new Client({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS
			],
			partials: ["MESSAGE", "CHANNEL", "REACTION"]
		});

		// Get Commands
		const files = GetDirectoryFiles(__dirname + "/Commands");
		
		for (var file of files) {
			const command = require(__dirname + "/Commands/" + file);
			this._Commands[command.Name] = command;
		}
	}

	public FetchCommand = (message: any) => {
		const { content } = message;

		if (content.startsWith(config.Prefix)) {
			const split = content.split(" ");
			const args = [];

			var prefix: any = config.Prefix;

			var command_name: string = split[0].substring(prefix.length, split[0].length);
			var command: any = this._Commands[command_name]

			split[0] = null;

			if (!command) {
				console.log("Command not found: " + command_name);
				return
			}

			for (var i = 1; i <= command.Args; i++) {
				args.push(split[i]);
				split[i] = null;
			}

			var final_arg = split.join(" ");

			args.push(final_arg.substring(1, final_arg.length));

			return { Command: command, Args: args };
		}
	}

	public Start = () => {
		// Create event listeners
		this._Client.on("ready", () => {
			console.log(`${this._Client.user.tag} is online!`);
		});

		this._Client.on("messageCreate", async (message: any) => {
			const { content } = message;

			if (content == config.Prefix + "uptime") {
				const uptime: number = Math.floor((Date.now() - this._StartTime) / 1000);

				const hours: number = Math.floor(uptime / 3600);
				const minutes: number = Math.floor(uptime / 60);

				message.reply(`Bot has been online for ${hours} hour(s) and ${minutes} minute(s).`);

				return;
			}

			const info: any = this.FetchCommand(message);

			if (!info) return

			info.Command.Execute(message, info.Args).catch(console.error);
		})

		// Start the client
		this._Client.login(this._Token);
	}
}