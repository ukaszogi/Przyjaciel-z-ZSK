module.exports = (client, message) => {

    if (message.author.bot) return;
    if (message.content === "mucha") message.channel.send("rucha karalucha")
    if (message.content === "america") message.channel.send("FUCK YEAH!!!");
    if (message.content.split(' ')[0] === "score") client.commands.get("score").execute(client, message);
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    try {
        command.execute(client, message, args);
    } catch (e) {
        console.log(e)
    }
};
