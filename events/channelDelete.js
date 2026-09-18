const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "channelDelete",

    async execute(client, channel) {

        try {

            // Audit Log'un oluşmasını bekle
            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelDelete,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            // Eski logları sayma
            if (Date.now() - entry.createdTimestamp > 5000) return;

            // Doğru kanalı kontrol et
            if (!entry.target || entry.target.id !== channel.id) return;

            await guard({
                client,
                guild: channel.guild,
                executor: entry.executor,
                type: "Kanal Silme",
                limit: client.config.limits.channelDelete,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[CHANNEL DELETE]", err);

        }

    }
};