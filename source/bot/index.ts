// Modules
import * as config from "../config.json";
import { Bot } from "./bot";

const client = new Bot(config.Token, {});
client.Start();