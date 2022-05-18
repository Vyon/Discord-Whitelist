import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";

export function ReadFile(path: any) {
	return readFileSync(path);
}

export function WriteFile(path: string, payload: string) {
	return writeFileSync(path, payload);
}

export function GetDirectoryFiles(path: string) {
	return readdirSync(path);
}

export function DeleteFile(path: string) {
	return unlinkSync(path);
}