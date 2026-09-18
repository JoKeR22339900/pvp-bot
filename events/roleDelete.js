const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "roleDelete",

    async execute(client, role) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await role.guild.fetchAuditLogs({
                type: AuditLogEvent.RoleDelete,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== role.id) return;

            await guard({
                client,
                guild: role.guild,
                executor: entry.executor,
                type: "Rol Silme",
                limit: client.config.limits.roleDelete,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[ROLE DELETE]", err);

        }

    }
};