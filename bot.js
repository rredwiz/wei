import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const TOKEN = process.env.DISCORD_BOT_TOKEN;

client.on("clientReady", async () => {
    console.log("discord bot is logged in");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // if (commandName === "wei") await doWei();
});

client.login(TOKEN);
