module.exports = {
    name: "los",
    description: "Losuje liczbę od 0 do podanej liczby",
    aliases: ['los'],
    usage: 'los [liczba]',
    execute(client, message, args) {
        if (args[0] != null && Number.isInteger(Math.floor(Math.random() * args[0])))
            message.channel.send(Math.floor(Math.random() * args[0]));
        else msg.channel.send("wpisz liczbe np. los 100");
    }
}
