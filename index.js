import fs from "node:fs";
import { fork } from "node:child_process";

const files = fs.readdirSync("./bots/");
for (const file of files) {
    fork("./bot.js", {
        env: {
            ...process.env,
            FILE: `./bots/${file}`,
        },
        silent: false,
    });
}
