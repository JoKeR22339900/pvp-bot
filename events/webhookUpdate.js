const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "webhooksUpdate",

    async execute(client, channel) {

        try {

            await new Promise(resolve => setTimeout(resolve, 2000));

            const logs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.WebhookCreate,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            await guard({
                client,
                guild: channel.guild,
                executor: entry.executor,
                type: "Webhook Oluşturma",
                limit: client.config.limits.webhook,
                punishment: "kick"
            });

            // Oluşturulan webhook'u sil
            if (entry.target) {
                const hooks = await channel.fetchWebhooks();

                const hook = hooks.get(entry.target.id);

                if (hook) await hook.delete("Guard | Webhook Koruması");
            }

        } catch (err) {
            console.error("[WEBHOOK]", err);
        }

    }
};