const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "guildUpdate",

    async execute(client, oldGuild, newGuild) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1500));

            const logs = await newGuild.fetchAuditLogs({
                type: AuditLogEvent.GuildUpdate,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            await guard({
                client,
                guild: newGuild,
                executor: entry.executor,
                type: "Sunucu Güncelleme",
                limit: client.config.limits.guildUpdate,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[GUILD UPDATE]", err);

        }

    }
};