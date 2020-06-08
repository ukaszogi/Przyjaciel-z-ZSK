module.exports = {
    name: "los",
    description: "Losuje liczbę od 0 do podanej liczby",
    aliases: ['los'],
    usage: 'los [liczba]',
    category: 'fun',
    execute(client, message, args) {
        if (args[0] != null && Number.isInteger(Math.floor(Math.random() * args[0])))
            message.channel.send(Math.floor(Math.random() * args[0]));
        else message.channel.send("wpisz liczbe np. los 100");
    }
}
