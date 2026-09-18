const whitelist = require("./whitelist");
const logger = require("./logger");
const db = require("./database");

const counters = new Map();

module.exports = async ({
    client,
    guild,
    executor,
    type,
    limit,
    punishment = "kick"
}) => {

    const settings = db.read("settings.json");

    if (!settings.guard) return;
    if (!executor) return;

    if (executor.id === client.user.id) return;

    if (executor.id === client.config.ownerID) return;

    if (executor.id === guild.ownerId) return;

    if (whitelist.has(executor.id)) return;

    const key = `${guild.id}:${executor.id}:${type}`;

    const count = (counters.get(key) || 0) + 1;

    counters.set(key, count);

    setTimeout(() => counters.delete(key), 10000);

    console.log(`[GUARD] ${executor.tag} | ${type} | ${count}/${limit}`);

    if (count < limit) return;

    counters.delete(key);

    const member = await guild.members.fetch(executor.id).catch(() => null);

    if (!member) return;

    try {

        await member.roles.set([]);

    } catch {}

    try {

        if (punishment === "kick" && member.kickable)
            await member.kick(`Guard | ${type}`);

        if (punishment === "ban" && member.bannable)
            await member.ban({ reason: `Guard | ${type}` });

    } catch {}

    await logger(guild, client, {
        color: 0xff0000,
        title: "🛡️ Guard",
        description:
`**Yetkili:** <@${executor.id}>
**Koruma:** ${type}
**Ceza:** ${punishment.toUpperCase()}`,
        timestamp: new Date()
    });

};