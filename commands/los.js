module.exports = {
    name: "los",
    description: "",
    aliases: ['los'],
    execute(client, message, args) {
        if (args[0] != null && Number.isInteger(Math.floor(Math.random() * args[0])))
            message.channel.send(Math.floor(Math.random() * args[0]));
        else msg.channel.send("wpisz liczbe np. los 100");
    }
}
