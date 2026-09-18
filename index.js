require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.GuildMember,
        Partials.User
    ]
});

client.commands = new Collection();
client.config = require("./config.json");

// =====================
// COMMAND HANDLER
// =====================

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(`./commands/${file}`);

        if (!command.data || !command.execute) {
            console.log(`[COMMAND] ${file} yüklenemedi.`);
            continue;
        }

        console.log(command.data.name, file);

        client.commands.set(command.data.name, command);

        console.log(`[COMMAND] ${command.data.name} yüklendi.`);
    }

}

// =====================
// EVENT HANDLER
// =====================

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {

        const event = require(`./events/${file}`);

        if (event.once) {

            client.once(event.name, (...args) => event.execute(client, ...args));

        } else {

            client.on(event.name, (...args) => event.execute(client, ...args));

        }

        console.log(`[EVENT] ${event.name} yüklendi.`);
    }

}

// =====================

client.login(process.env.TOKEN);