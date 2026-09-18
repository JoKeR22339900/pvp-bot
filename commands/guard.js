const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const db = require("../utils/database");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("guard")

        .setDescription("Guard sistemini yönetir")

        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommand(sub =>
            sub
                .setName("aç")
                .setDescription("Guard sistemini açar")
        )

        .addSubcommand(sub =>
            sub
                .setName("kapat")
                .setDescription("Guard sistemini kapatır")
        )

        .addSubcommand(sub =>
            sub
                .setName("durum")
                .setDescription("Guard durumunu gösterir")
        ),

    async execute(interaction) {

        let settings = db.read("settings.json");

        const sub = interaction.options.getSubcommand();

        if (sub === "aç") {

            settings.guard = true;

            db.write("settings.json", settings);

            return interaction.reply("🟢 Guard sistemi açıldı.");

        }

        if (sub === "kapat") {

            settings.guard = false;

            db.write("settings.json", settings);

            return interaction.reply("🔴 Guard sistemi kapatıldı.");

        }

        interaction.reply(
            `Guard Durumu : **${settings.guard ? "🟢 AÇIK" : "🔴 KAPALI"}**`
        );

    }

};