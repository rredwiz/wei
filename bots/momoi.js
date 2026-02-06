import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

export const botConfig = {
    name: "momoi",
    token: process.env.MOMOI_TOKEN,
    chance: 0.999,
    msgSlashName: "momoi",
    voiceSlashName: "momoijoin",
};

export function getPunctuation() {
    let punctuation = "";
    let punctuationFloat = Math.random();

    if (punctuationFloat > 0.66) punctuation = "!";
    else if (punctuationFloat > 0.33) punctuation = "?";

    return punctuation;
}

export function buildStringPing() {
    return "那个" + "?";
}

export function buildStringMessage() {
    // 1 to 3 mambos randomly
    const numOfMambos = Math.floor(Math.random() * 3) + 1;
    const punctuation = getPunctuation();
    let mamboString = "那个";

    for (let i = 1; i < numOfMambos; i++) {
        mamboString += " 那个"
    }

    return mamboString + punctuation;
}
