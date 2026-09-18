const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "channelCreate",

    async execute(client, channel) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelCreate,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== channel.id) return;

            await guard({
                client,
                guild: channel.guild,
                executor: entry.executor,
                type: "Kanal Oluşturma",
                limit: client.config.limits.channelCreate,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[CHANNEL CREATE]", err);

        }

    }
};