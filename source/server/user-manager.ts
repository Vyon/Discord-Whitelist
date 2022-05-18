import * as bcrypt from "bcrypt";
import { AdminKey } from "../config.json";
import { JSONFormat, GenerateKey } from "./util";
import { writeFileSync, readFileSync } from "fs";

export async function GetUserById(id: number) {
	const users = readFileSync(__dirname + "/../database/users.json", "utf-8");

	if (!users) {
		console.log("Something has gone wrong in the database for \"users\"");
		return false;
	}

	let users_json = JSON.parse(users);
	
	let user = users_json.find((user: any) => user.ID == id);

	if (user) {
		return user;
	}
}

export async function GetUserByName(username: string) {
	const users = readFileSync(__dirname + "/../database/users.json", "utf-8");

	if (!users) {
		console.log("Something has gone wrong in the database for \"users\"");
		return false;
	}

	let users_json = JSON.parse(users);
	
	let user = users_json.find((user: any) => user.Username == username);

	if (user) {
		return user;
	}
}

export async function GetUserByDiscordId(discord_id: string) {
	const users = readFileSync(__dirname + "/../database/users.json", "utf-8");

	if (!users) {
		console.log("Something has gone wrong in the database for \"users\"");
		return false;
	}

	let users_json = JSON.parse(users);

	let user = users_json.find((user: any) => user.DiscordId == discord_id);

	if (user) {
		return user;
	}
}

export async function CreateUser(username: string, password: string) {
	const users = readFileSync(__dirname + "/../database/users.json", "utf-8");
	if (!users) {
		console.log("Something has gone wrong in the database for \"users\"");
		return {success:false, message:"Error code 500, internal server error."};
	}

	let users_json = JSON.parse(users);

	if (await GetUserByName(username)) {
		return {success:false, message:"Username already exists."};
	}

	let user_id = users_json.length + 1

	let user = {
		ID: user_id,
		Username: username,
		Password: await bcrypt.hash(password, 10),
		WhitelistKey: user_id != 1 && GenerateKey(20) || AdminKey,
		DiscordId: "",
		Blacklisted: false
	}

	users_json.push(user);

	writeFileSync(__dirname + "/../database/users.json", JSONFormat(users_json, 4));
	return {success:true, message:"User created successfully."};
}

export async function UpdateUser(username: string, values: any, message: string) {
	const users = readFileSync(__dirname + "/../database/users.json", "utf-8");
	if (!users) {
		console.log("Something has gone wrong in the database for \"users\"");
		return {success:false, message:"Error code 500, internal server error."};
	}

	let users_json = JSON.parse(users);
	let user = users_json.find((user: any) => user.Username == username);

	if (!user) {
		return {success:false, message:"User doesn\'t exist."};
	}

	// I hate how typescript works :)
	for (let user_index in users_json) {
		let user = users_json[user_index]

		if (user.Username == username) {
			let data = user;

			for (let key in values) {
				data[key] = values[key];
			}

			users_json[user_index] = data;
		}
	}

	writeFileSync(__dirname + "/../database/users.json", JSONFormat(users_json, 4));
	return {success:true, message:message};
}