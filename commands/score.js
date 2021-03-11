module.exports = {
    name: "score",
    description: "wyświrtla/updateuje tablice wyników",
    aliases: [],
    usage: 'score [twój wynik] | score',
    category: 'fun',
    execute(client, message, args) {
      message.channel.send(message.author.id, args[1]);
    }
}
