module.exports = {
    name: "ping",
    description: "Odpowiada: Pong!",
    aliases: ['pong'],
    usage: 'ping',
    category: 'other',
    execute(client, message) {
        const args = message.content.slice(client.config.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (commandName === 'pong') message.reply('Ping?')
        else message.reply('Pong!')
    }
}
