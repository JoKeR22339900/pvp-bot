const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");
const db = require("../utils/database");

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {

        if (!member.user.bot) return;

        // Guard kapalıysa hiçbir işlem yapma
        const settings = db.read("settings.json");

        if (!settings.guard) return;

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.BotAdd,
                limit: 1
            });

            const entry = logs.entries.first();

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== member.user.id) return;

            await guard({
                client,
                guild: member.guild,
                executor: entry.executor,
                type: "Bot Ekleme",
                limit: client.config.limits.botAdd,
                punishment: "kick"
            });

            // Eklenen botu sadece Guard açıksa çıkar
            await member.kick("Guard | Yetkisiz Bot Ekleme").catch(() => {});

        } catch (err) {

            console.error("[BOT ADD GUARD]", err);

        }

    }
};
