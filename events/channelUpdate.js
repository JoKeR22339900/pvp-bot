const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "channelUpdate",

    async execute(client, oldChannel, newChannel) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await newChannel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelUpdate,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== newChannel.id) return;

            await guard({
                client,
                guild: newChannel.guild,
                executor: entry.executor,
                type: "Kanal Düzenleme",
                limit: client.config.limits.channelUpdate,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[CHANNEL UPDATE]", err);

        }

    }
};