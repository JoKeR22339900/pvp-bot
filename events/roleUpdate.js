const {
    AuditLogEvent,
    PermissionsBitField
} = require("discord.js");

const guard = require("../utils/guard");

module.exports = {
    name: "roleUpdate",

    async execute(client, oldRole, newRole) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await newRole.guild.fetchAuditLogs({
                type: AuditLogEvent.RoleUpdate,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== newRole.id) return;

            const dangerousPermissions = [
                PermissionsBitField.Flags.Administrator,
                PermissionsBitField.Flags.ManageRoles,
                PermissionsBitField.Flags.ManageChannels,
                PermissionsBitField.Flags.ManageWebhooks,
                PermissionsBitField.Flags.BanMembers,
                PermissionsBitField.Flags.KickMembers,
                PermissionsBitField.Flags.MentionEveryone,
                PermissionsBitField.Flags.ModerateMembers
            ];

            let changed = false;

            for (const permission of dangerousPermissions) {

                if (
                    !oldRole.permissions.has(permission) &&
                    newRole.permissions.has(permission)
                ) {

                    changed = true;
                    break;

                }

            }

            if (changed) {

                await newRole.setPermissions(
                    oldRole.permissions,
                    "Guard | Tehlikeli Yetkiler Geri Alındı"
                ).catch(() => {});

            }

            await guard({
                client,
                guild: newRole.guild,
                executor: entry.executor,
                type: "Rol Düzenleme",
                limit: client.config.limits.roleUpdate,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[ROLE UPDATE]", err);

        }

    }
};