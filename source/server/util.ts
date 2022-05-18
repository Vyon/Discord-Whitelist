export function JSONFormat(object: any, indent: number) {
	return JSON.stringify(object, null, indent);
}

export function GenerateKey(length: number) {
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let key = "";

	for (let i = 0; i < length; i++) {
		key += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return key;
}