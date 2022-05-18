// Imports
import * as config from "../config.json";
import * as user_manager from "./user-manager";
import express from "express";
import bodyParser from "body-parser";
import { exec } from "child_process";
import { compare } from "bcrypt";
import { BlacklistUser, CheckWhitelist, WhitelistUser } from "./whitelist-manager";

exec("ts-node " + __dirname + "/../bot/index", (_, output) => {
	console.log("Bot process has ended.");
})

// App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Constants
const api_endpoint: string = "/api/" + config.Version + "/";

// Endpoints
// Endpoint for creating new users.
app.post(api_endpoint + "user/create", async (request: any, response: any) => {
	const body: any = request.body;

	const username: string | undefined = body.Username;
	const password: string | undefined = body.Password;

	if (!username || !password) {
		response.send("Missing username or password");
		return;
	}

	const status = await user_manager.CreateUser(username, password);

	response.send(status.message);
})

// Endpoint for user logins
app.post(api_endpoint + "user/login", async (request: any, response: any) => {
	const body = request.body;
	
	const username: string | undefined = body.Username;
	const password: string | undefined = body.Password;
	const discord_id: string | undefined = body.DiscordId;

	if (!username || !password || !discord_id) {
		response.send("Missing body parameter(s)");
		return;
	}

	const user = await user_manager.GetUserByName(username);

	if (!user) {
		response.send("Invalid username or password.");
		return;
	} else if (user.DiscordId.length > 0) {
		response.send("Please sign out of your current account before attempting to login again.");
		return;
	}

	if (await compare(password, user.Password)) {
		const status = await user_manager.UpdateUser(username, {
			DiscordId: discord_id
		}, "You have logged in.")

		response.send(status.message);
	} else {
		response.send("Invalid username or password.");
	}
})

// Logs a user out of their account
app.post(api_endpoint + "user/logout", async (request: any, response: any) => {
	const body: any = request.body;
	const discord_id: string | undefined = body.DiscordId;

	if (!discord_id) {
		response.send("Missing DiscordId");
		return;
	}

	const user = await user_manager.GetUserByDiscordId(discord_id);

	if (!user) {
		response.send("You are not currently logged in.");
		return;
	}

	const status = await user_manager.UpdateUser(user.Username, {
		DiscordId: ""
	}, "Successfully logged out.")

	response.send(status.message);
})

// Checks if a user is whitelisted
app.get(api_endpoint + "whitelist", async (request: any, response: any) => {
	const headers = request.headers;
	const discord_id: string | undefined = headers.discordid;

	if (!discord_id) {
		response.send("Missing DiscordId");
		return;
	}
	
	const isWhitelisted: any = await CheckWhitelist(discord_id);

	if (isWhitelisted) {
		response.send("You are whitelisted.");
	} else {
		response.send("You are not whitelisted.");
	}
})

// Whitelists a user
app.post(api_endpoint + "whitelist", async (request: any, response: any) => {
	const body: any = request.body;
	const discord_id: string | undefined = body.DiscordId;

	if (!discord_id) {
		response.send("Missing DiscordId");
		return;
	}

	const user = await user_manager.GetUserByDiscordId(discord_id);
	
	if (!user) {
		response.send("User not found.");
		return;
	}

	if (user.WhitelistKey != config.AdminKey) {
		response.send("You cannot whitelist users.");
		return;
	}

	const status = await WhitelistUser(discord_id);

	response.send(status.message);
})

// Blacklists a user.
app.post(api_endpoint + "blacklist", async (request: any, response: any) => {
	const body: any = request.body;
	const id: number | undefined = body.DiscordId;

	if (typeof(id) !== "string") {
		response.send("Missing DiscordId");
		return;
	}

	const status = await BlacklistUser(id);
	
	response.send(status.message);
})

// Gets a user's whitelist key
app.get(api_endpoint + "get-key", async (request: any, response: any) => {
	const headers = request.headers;
	const discord_id: string | undefined = headers.discordid;

	if (!discord_id) {
		response.send("Missing DiscordId");
		return;
	}

	const user = await user_manager.GetUserByDiscordId(discord_id);

	if (!user) {
		response.send("User not found.");
		return;
	}

	response.send(user.WhitelistKey);
})

app.listen(config.Port, () => {
	console.log("Server started on port " + config.Port);
})