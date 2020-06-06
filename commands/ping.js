module.exports = {
    name: "ping",
    description: "",
    aliases: ['pong'],
    execute(client, message) {
        message.reply('pong');
    }
}
