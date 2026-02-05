import {
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

const clientId = process.env.WEI_CLIENT_ID;
const guildId = process.env.DISCORD_BOT_GUILD_ID;
const token = process.env.WEI_TOKEN;

// commands go here
const commands = [
    new SlashCommandBuilder()
        .setName("wei")
        .setDescription("wei."),
    new SlashCommandBuilder()
        .setName("weijoin")
        .setDescription("weiiii!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), // use applicationCommands(clientId) for global
            { body: commands }
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
