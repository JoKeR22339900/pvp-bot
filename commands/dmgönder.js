const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("dmgönder")
        .setDescription("Belirli bir role DM duyurusu gönderir.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addRoleOption(option =>
            option
                .setName("rol")
                .setDescription("DM gönderilecek rol")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("aciliyet")
                .setDescription("Duyuru türü")
                .setRequired(true)
                .addChoices(
                    { name: "🔴 Acil", value: "acil" },
                    { name: "🟡 Normal", value: "normal" },
                    { name: "🔵 Bilgilendirme", value: "bilgi" },
                    { name: "🟢 Etkinlik", value: "etkinlik" }
                )
        )

        .addStringOption(option =>
            option
                .setName("mesaj")
                .setDescription("Gönderilecek mesaj")
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const role = interaction.options.getRole("rol");
        const message = interaction.options.getString("mesaj");
        const aciliyet = interaction.options.getString("aciliyet");

        await interaction.guild.members.fetch();

        const members = role.members;

        console.log(`Role sahip üye sayısı: ${members.size}`);

        if (!members.size) {

            return interaction.editReply({
                content: "❌ Bu rolde hiç üye bulunamadı."
            });

        }

        let color;
        let title;

        switch (aciliyet) {

            case "acil":
                color = "#ff0000";
                title = "🚨 ACİL DUYURU";
                break;

            case "normal":
                color = "#f1c40f";
                title = "📢 DUYURU";
                break;

            case "bilgi":
                color = "#3498db";
                title = "ℹ️ BİLGİLENDİRME";
                break;

            case "etkinlik":
                color = "#2ecc71";
                title = "🎉 ETKİNLİK";
                break;

            default:
                color = "#5865F2";
                title = "📢 DUYURU";

        }

        let success = 0;
        let failed = 0;

        for (const [, member] of members) {

            const embed = new EmbedBuilder()

                .setColor(color)

                .setTitle("𝟳𝟳𝟳 𝙎.𝙏")

                .setDescription(
`━━━━━━━━━━━━━━━━━━━━━━

## ${title}

${message}

━━━━━━━━━━━━━━━━━━━━━━`
                )

                .setThumbnail(
                    interaction.guild.iconURL({
                        dynamic: true
                    })
                )

                .setFooter({
                    text: `Gönderen: ${interaction.user.username} • 𝟳𝟳𝟳 𝙎.𝙏`
                })

                .setTimestamp();

try {

    await member.send({

        content: `👋 Merhaba ${member}`,

        embeds: [embed]

    });

    console.log(`✅ Gönderildi: ${member.user.tag}`);

    success++;

} catch (err) {

    failed++;

    console.log(`❌ Gönderilemedi: ${member.user.tag}`);
    console.log(err);

}

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

        }

        interaction.editReply({

            content:
`✅ DM gönderimi tamamlandı.

👥 Rol: ${role}

📨 Başarılı: ${success}

❌ Başarısız: ${failed}`

        });

    }

};