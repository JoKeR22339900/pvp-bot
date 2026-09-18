const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const whitelist = require("../utils/whitelist");
const os = require("os");
const pkg = require("../package.json");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("istatistik")
        .setDescription("Bot istatistiklerini gösterir"),

    async execute(interaction) {

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("📊 Guard Bot İstatistikleri")

            .addFields(

                {
                    name: "🏓 Ping",
                    value: `${interaction.client.ws.ping} ms`,
                    inline: true
                },

                {
                    name: "💾 RAM",
                    value: `${ram} MB`,
                    inline: true
                },

                {
                    name: "⚙️ CPU",
                    value: os.cpus()[0].model,
                    inline: false
                },

                {
                    name: "🕒 Uptime",
                    value: `${days} Gün ${hours} Saat ${minutes} Dakika ${seconds} Saniye`,
                    inline: false
                },

                {
                    name: "🌍 Sunucu",
                    value: `${interaction.client.guilds.cache.size}`,
                    inline: true
                },

                {
                    name: "👥 Kullanıcı",
                    value: `${interaction.client.users.cache.size}`,
                    inline: true
                },

                {
                    name: "✅ Whitelist",
                    value: `${whitelist.list().length}`,
                    inline: true
                },

                {
                    name: "📦 Node.js",
                    value: process.version,
                    inline: true
                },

                {
                    name: "🤖 Discord.js",
                    value: pkg.dependencies["discord.js"].replace("^", ""),
                    inline: true
                }

            )

            .setTimestamp();

        interaction.reply({
            embeds: [embed]
        });

    }

};