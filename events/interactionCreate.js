module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {

            await command.execute(interaction);

        } catch (err) {

            console.error(err);

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp({
                    content: "❌ Komut çalıştırılırken hata oluştu."
                }).catch(() => {});

            } else {

                await interaction.reply({
                    content: "❌ Komut çalıştırılırken hata oluştu.",
                    ephemeral: true
                }).catch(() => {});

            }

        }

    }
};