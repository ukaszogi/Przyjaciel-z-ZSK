module.exports = {
    name: "ping",
    description: "",
    aliases: ['pong'],
    usage: 'ping',
    execute(client, message) {
        message.reply('pong');
    }
}
