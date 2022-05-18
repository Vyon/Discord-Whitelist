import { readFileSync, writeFileSync } from "fs";
import { GetUserByDiscordId, UpdateUser } from "./user-manager";
import { JSONFormat } from "./util";

function FetchWhitelist() {
	const whitelist = readFileSync(__dirname + "/../database/whitelist.json", "utf-8");

	if (!whitelist) {
		console.log("Something has gone wrong in the database for \"whitelist\"");
		return false;
	}

	let whitelist_json = JSON.parse(whitelist);

	return whitelist_json;
}

export async function CheckWhitelist(discord_id: string) {
	let whitelist_json = FetchWhitelist();

	let whitelisted = whitelist_json.find((id: any) => id == discord_id);

	if (whitelisted) {
		return true;
	}
}

export async function WhitelistUser(discord_id: string) {
	let whitelist_json = FetchWhitelist();

	let whitelisted = whitelist_json.find((id: any) => id == discord_id);

	if (whitelisted) {
		return {success:false, message:"User is already whitelisted."};
	} else {
		let user = await GetUserByDiscordId(discord_id);

		if (!user) {
			return {success:false, message:"User does not exist."};
		}

		if (user.Blacklisted) {
			return {success: false, message: "User is blacklisted."};
		}

		whitelist_json.push(discord_id);

		writeFileSync(__dirname + "/../database/whitelist.json", JSONFormat(whitelist_json, 4));

		return {success:true, message:"User has been whitelisted."};
	}
}

export async function BlacklistUser(discord_id: string) {
	let whitelist_json = FetchWhitelist();

	let user = await GetUserByDiscordId(discord_id);

	if (!user) {
		return {success:false, message:"User ."};
	}

	let index = whitelist_json.indexOf(discord_id);
	whitelist_json.splice(index, 1);

	await UpdateUser(user.Username, {Blacklisted: true}, "User has been blacklisted.");

	writeFileSync(__dirname + "/../database/whitelist.json", JSONFormat(whitelist_json, 4));

	return {success:true, message:"User has been blacklisted."};
}