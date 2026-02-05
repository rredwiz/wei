import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

export const botConfig = {
    name: "wei",
    token: process.env.WEI_TOKEN,
    msgSlashName: "wei",
    voiceSlashName: "weijoin",
};

export function getPunctuation() {
    let punctuation = "";
    let punctuationFloat = Math.random();

    if (punctuationFloat > 0.66) punctuation = "!";
    else if (punctuationFloat > 0.33) punctuation = "?";

    return punctuation;
}

export function buildStringPing() {
    const numOfI = Math.floor(Math.random() * 10) + 1;
    const numOfE = Math.floor(Math.random() * 10) + 1;

    return "w" + "e".repeat(numOfE) + "i".repeat(numOfI) + "?";
}

export function buildStringMessage() {
    const numOfI = Math.floor(Math.random() * 10) + 1;
    const numOfE = Math.floor(Math.random() * 10) + 1;
    const punctuation = getPunctuation();

    return "w" + "e".repeat(numOfE) + "i".repeat(numOfI) + punctuation;
}
