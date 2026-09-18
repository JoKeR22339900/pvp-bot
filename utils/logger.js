module.exports = async function logger(guild, client, embed) {

    const channel = guild.channels.cache.get(client.config.logChannelID);

    if (!channel) return;

    channel.send({
        embeds: [embed]
    }).catch(() => {});

};