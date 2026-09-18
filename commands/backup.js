const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

const db = require("../utils/database");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("backup")
        .setDescription("Sunucu yedek sistemi")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommand(sub =>
            sub
                .setName("al")
                .setDescription("Sunucunun yedeğini al")
        )

        .addSubcommand(sub =>
            sub
                .setName("yükle")
                .setDescription("Son alınan yedeği yükle")
        ),

    async execute(interaction) {

        await interaction.deferReply();

        const guild = interaction.guild;
        const sub = interaction.options.getSubcommand();

        if (sub === "al") {

            const backup = {

                id: guild.id,

                name: guild.name,

                createdAt: Date.now(),

                roles: guild.roles.cache

                    .filter(r => r.id !== guild.id)

                    .sort((a, b) => a.position - b.position)

                    .map(role => ({

                        name: role.name,

                        color: role.color,

                        hoist: role.hoist,

                        permissions: role.permissions.bitfield.toString(),

                        position: role.position,

                        mentionable: role.mentionable

                    })),

                channels: guild.channels.cache

                    .sort((a, b) => a.position - b.position)

                    .map(channel => ({

                        name: channel.name,

                        type: channel.type,

                        parent: channel.parent?.name || null,

                        position: channel.position,

                        topic: channel.topic ?? null,

                        nsfw: channel.nsfw ?? false,

                        rateLimitPerUser: channel.rateLimitPerUser ?? 0,

                        bitrate: channel.bitrate ?? null,

                        userLimit: channel.userLimit ?? null,

                        permissionOverwrites: channel.permissionOverwrites.cache.map(p => ({

                            id: p.id,

                            allow: p.allow.bitfield.toString(),

                            deny: p.deny.bitfield.toString()

                        }))

                    }))

            };

            let backups = db.read("backups.json");

            backups = backups.filter(x => x.id !== guild.id);

            backups.push(backup);

            db.write("backups.json", backups);

            return interaction.editReply({

                content:
`✅ Backup başarıyla alındı.

📂 Kanal Sayısı: ${backup.channels.length}
🎭 Rol Sayısı: ${backup.roles.length}`

            });

        }

        if (sub === "yükle") {

            const backups = db.read("backups.json");

            const backup = backups.find(x => x.id === guild.id);

            if (!backup) {

                return interaction.editReply({

                    content: "❌ Bu sunucu için kayıtlı backup bulunamadı."

                });

            }

            let createdRoles = 0;

            for (const role of backup.roles) {

                const exists = guild.roles.cache.find(r =>

                    r.name === role.name &&
                    r.color === role.color &&
                    r.permissions.bitfield.toString() === role.permissions

                );

                if (exists) continue;

                try {

                    await guild.roles.create({

                        name: role.name,

                        color: role.color,

                        hoist: role.hoist,

                        permissions: BigInt(role.permissions),

                        mentionable: role.mentionable,

                        reason: "Backup Restore"

                    });

                    createdRoles++;

                } catch (err) {

                    console.log("Rol oluşturulamadı:", role.name);

                }

            }

                        let createdCategories = 0;

            const categories = backup.channels
                .filter(c => c.type === ChannelType.GuildCategory)
                .sort((a, b) => a.position - b.position);

            for (const category of categories) {

                const exists = guild.channels.cache.find(c =>
                    c.type === ChannelType.GuildCategory &&
                    c.name === category.name
                );

                if (exists) continue;

                try {

                    await guild.channels.create({

                        name: category.name,

                        type: ChannelType.GuildCategory,

                        position: category.position,

                        reason: "Backup Restore"

                    });

                    createdCategories++;

                } catch (err) {

                    console.log("Kategori oluşturulamadı:", category.name);

                }

            }

            let createdChannels = 0;

            const channels = backup.channels
                .filter(c => c.type !== ChannelType.GuildCategory)
                .sort((a, b) => a.position - b.position);

            for (const channel of channels) {

                const exists = guild.channels.cache.find(c =>
                    c.name === channel.name &&
                    c.type === channel.type
                );

                if (exists) continue;

                const parent = channel.parent
                    ? guild.channels.cache.find(c =>
                        c.type === ChannelType.GuildCategory &&
                        c.name === channel.parent
                    )
                    : null;

                try {

                    const created = await guild.channels.create({

                        name: channel.name,

                        type: channel.type,

                        parent: parent?.id,

                        topic: channel.topic ?? undefined,

                        nsfw: channel.nsfw ?? false,

                        rateLimitPerUser: channel.rateLimitPerUser ?? 0,

                        bitrate: channel.bitrate ?? undefined,

                        userLimit: channel.userLimit ?? undefined,

                        position: channel.position,

                        reason: "Backup Restore"

                    });

                    if (channel.permissionOverwrites?.length) {

                        await created.permissionOverwrites.set(

                            channel.permissionOverwrites.map(p => ({

                                id: p.id,

                                allow: BigInt(p.allow),

                                deny: BigInt(p.deny)

                            }))

                        ).catch(() => {});

                    }

                    createdChannels++;

                } catch (err) {

                    console.log("Kanal oluşturulamadı:", channel.name);

                }

            }

            return interaction.editReply({

                content:
`✅ Backup başarıyla geri yüklendi.

🎭 Oluşturulan Roller: ${createdRoles}
📁 Oluşturulan Kategoriler: ${createdCategories}
💬 Oluşturulan Kanallar: ${createdChannels}`

            });

        }

    }

};