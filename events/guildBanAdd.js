const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "guildBanAdd",

    async execute(client, ban) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== ban.user.id) return;

            await guard({
                client,
                guild: ban.guild,
                executor: entry.executor,
                type: "Ban Koruması",
                limit: client.config.limits.ban,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[BAN GUARD]", err);

        }

    }
};