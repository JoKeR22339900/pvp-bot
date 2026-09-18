require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if (!command.data || !command.execute) {
        console.log(`❌ ${file} yüklenemedi.`);
        continue;
    }

    commands.push(command.data.toJSON());

    console.log(`✅ ${command.data.name} yüklendi.`);
}

console.log("\n==============================");
console.log("Yüklenecek Slash Komutları:");
console.log(commands.map(cmd => cmd.name));
console.log("==============================\n");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log("Slash komutları sunucuya yükleniyor...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log("✅ Slash komutları başarıyla yüklendi.");

    } catch (err) {

        console.error("❌ Deploy Hatası");
        console.error(err);

    }

})();