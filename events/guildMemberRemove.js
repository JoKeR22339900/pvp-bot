const { AuditLogEvent } = require("discord.js");
const guard = require("../utils/guard");

module.exports = {
    name: "guildMemberRemove",

    async execute(client, member) {

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            const logs = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberKick,
                limit: 1
            });

            const entry = logs.entries.first();

            console.log("========== KICK AUDIT ==========");

if (!entry) {
    console.log("Audit Log bulunamadı.");
    return;
}

console.log("Executor:", entry.executor?.tag);
console.log("Executor ID:", entry.executor?.id);
console.log("Target:", entry.target?.tag);
console.log("Target ID:", entry.target?.id);
console.log("Kicklenen:", member.user.tag);
console.log("Kicklenen ID:", member.id);
console.log("Log Yaşı:", Date.now() - entry.createdTimestamp);

console.log("===============================");

            if (!entry) return;

            if (Date.now() - entry.createdTimestamp > 5000) return;

            if (!entry.target || entry.target.id !== member.id) return;

            // Bot kendi attığı kickleri saymasın
            if (entry.executor.id === client.user.id) return;

            await guard({
                client,
                guild: member.guild,
                executor: entry.executor,
                type: "Kick Koruması",
                limit: client.config.limits.kick,
                punishment: "kick"
            });

        } catch (err) {

            console.error("[KICK GUARD]", err);

        }

    }
};