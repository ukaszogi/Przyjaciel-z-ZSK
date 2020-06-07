module.exports = {
    name: "ping",
    description: "Odpowiada: Pong!",
    aliases: ['pong'],
    usage: 'ping',
    execute(client, message) {
        message.reply('Pong!');
    }
}
