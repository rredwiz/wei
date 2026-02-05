const configPath = process.env.FILE;
const config = await import(configPath);
const { botConfig, buildStringPing, buildStringMessage } = config;

import fs from "node:fs";
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

const TOKEN = botConfig.token;

client.on("clientReady", async () => {
    console.log(`${botConfig.name} bot is logged in`);
});

async function sayString(interaction) {
    await interaction.deferReply();
    await interaction.editReply(buildStringMessage());
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const channel = message.channel;

    if (message.mentions.has(client.user)) {
        await message.reply(buildStringPing());
    } else if (message.content.toLowerCase().includes(botConfig.name)) {
        await channel.send(buildStringMessage());
    }
});

function randomSound() {
    // gets the number of files that start with bot name
    const files = fs.readdir('./bots/');
    const pattern = `/^${botConfig.name}`;
    const numOfFiles = files.filter(file => pattern.test(file)).length;

    const fileNum = Math.floor(Math.random() * numOfFiles) + 1
    return `${botConfig.name}${fileNum}.MP3`;
}

async function botLoop(connection, player) {
    await sleep(1000);
    if (Math.random() > 0.98) {
        await playSound(connection, player);
    } else {
        botLoop(connection, player);
    }
}

async function playSound(connection, player) {
    const soundpath = path.join(__dirname, 'audio', randomSound());
    const resource = createAudioResource(soundpath);

    player.removeAllListeners();

    await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, async () => {
        await botLoop(connection, player);
    });
}

async function handleJoin(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply("join a voice call dumbass");
    }

    await interaction.reply(`${botConfig.name} is arriving.`);

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
    botLoop(connection, player);
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    console.log("app id:" + interaction.applicationId);

    if (commandName === `${botConfig.name}`) await sayString(interaction);
    if (commandName === `${botConfig.name}join`) await handleJoin(interaction);
});

client.login(TOKEN);
