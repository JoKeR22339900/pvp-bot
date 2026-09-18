module.exports = {
    name: "clientReady",
    once: true,

    async execute(client) {

        console.log(`${client.user.tag} aktif!`);

        client.user.setActivity("🛡️ Guard Sistemi");

    }
};