const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const whitelist = require("../utils/whitelist");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("whitelist")
        .setDescription("Whitelist yönetimi")

        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addSubcommand(sub =>
    sub
        .setName("ekle")
        .setDescription("Whitelist'e kullanıcı ekle")
        .addUserOption(option =>
            option
                .setName("kullanici")
                .setDescription("Discord kullanıcısı")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("id")
                .setDescription("Discord kullanıcı ID'si")
                .setRequired(false)
        )
)

        .addSubcommand(sub =>
            sub
                .setName("sil")
                .setDescription("Whitelist'ten kullanıcı sil")
                .addUserOption(option =>
                    option
                        .setName("kullanici")
                        .setDescription("Kullanıcı")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("liste")
                .setDescription("Whitelist listesini göster")
        ),

    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        if (sub === "ekle") {

            const user = interaction.options.getUser("kullanici");

            whitelist.add(user.id);

            return interaction.reply({
                content: `✅ **${user.tag}** whitelist'e eklendi.`,
                ephemeral: true
            });

        }

        if (sub === "sil") {

            const user = interaction.options.getUser("kullanici");

            whitelist.remove(user.id);

            return interaction.reply({
                content: `❌ **${user.tag}** whitelist'ten kaldırıldı.`,
                ephemeral: true
            });

        }

        const list = whitelist.list();

        return interaction.reply({
            content: list.length
                ? `📋 **Whitelist:**\n${list.map(id => `<@${id}>`).join("\n")}`
                : "📋 Whitelist boş.",
            ephemeral: true
        });

    }

};