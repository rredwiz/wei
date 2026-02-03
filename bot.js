import path from "node:path";
import { sleep } from "./helpers.js";
import { Client, GatewayIntentBits } from "discord.js";
import { fileURLToPath } from 'node:url';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
} from "@discordjs/voice";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
});

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const TOKEN = process.env.DISCORD_BOT_TOKEN;

client.on("clientReady", async () => {
    console.log("discord bot is logged in");
});

async function doWei(interaction) {
    await interaction.deferReply();
    await interaction.editReply(buildWeiStringMessage());
}

function getWeiPunctuation() {
    let punctuation = "";
    let punctuationFloat = Math.random();

    if (punctuationFloat > 0.66) punctuation = "!";
    else if (punctuationFloat > 0.33) punctuation = "?";

    return punctuation;
}

function buildWeiStringPing() {
    const numOfI = Math.floor(Math.random() * 10) + 1;
    const numOfE = Math.floor(Math.random() * 10) + 1;

    return "w" + "e".repeat(numOfE) + "i".repeat(numOfI) + "?";
}

function buildWeiStringMessage() {
    const numOfI = Math.floor(Math.random() * 10) + 1;
    const numOfE = Math.floor(Math.random() * 10) + 1;
    const punctuation = getWeiPunctuation();

    return "w" + "e".repeat(numOfE) + "i".repeat(numOfI) + punctuation;
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const channel = message.channel;

    if (message.mentions.has(client.user)) {
        await message.reply(buildWeiStringPing());
    } else if (message.content.toLowerCase().includes("wei")) {
        await channel.send(buildWeiStringMessage());
    }
});

function randomSound() {
    const fileNum = Math.floor(Math.random() * 5) + 1
    return `wei${fileNum}.MP3`;
}

async function weiLoop(connection, player) {
    await sleep(1000);
    if (Math.random() > 0.98) {
        console.log("won the 1/50");
        await playWei(connection, player);
    } else {
        console.log("lost the 1/50");
        weiLoop(connection, player);
    }
}

async function playWei(connection, player) {
    const soundpath = path.join(__dirname, 'audio', randomSound());
    const resource = createAudioResource(soundpath);

    player.removeAllListeners();

    await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, async () => {
        await weiLoop(connection, player);
    });
}

async function handleJoinWei(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply("join a voice call dumbass");
    }

    await interaction.reply("Wei is arriving.");

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    player.once(AudioPlayerStatus.Playing, () => console.log('Player: Playing'));
    player.once(AudioPlayerStatus.Idle, () => console.log('Player: Idle (finished or failed)'));
    // start the loop
    weiLoop(connection, player);
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === "wei") await doWei(interaction);
    if (commandName === "joincall") await handleJoinWei(interaction);
});

client.login(TOKEN);
