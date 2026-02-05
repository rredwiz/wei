import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

export const botConfig = {
    name: "mambo",
    token: process.env.MAMBO_TOKEN,
    msgSlashName: "mambo",
    voiceSlashName: "mambojoin",
};

export function getPunctuation() {
    let punctuation = "";
    let punctuationFloat = Math.random();

    if (punctuationFloat > 0.66) punctuation = "!";
    else if (punctuationFloat > 0.33) punctuation = "?";

    return punctuation;
}

export function buildStringPing() {
    return "mambo" + "?";
}

export function buildStringMessage() {
    // 1 to 3 mambos randomly
    const numOfMambos = Math.floor(Math.random() * 3) + 1;
    const punctuation = getPunctuation();
    let mamboString = "mambo";

    for (let i = 1; i < numOfMambos; i++) {
        mamboString += " mambo"
    }

    return mamboString + punctuation;
}
