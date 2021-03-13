module.exports = {
    name: "score",
    description: "wyświrtla/updateuje tablice wyników",
    aliases: [],
    usage: 'score [twój wynik] | score',
    category: 'fun',
    execute(client, message) {
        const Keyv = require('keyv')
        const keyv = new Keyv(client.config.pathToDatabase);

        const args = message.content.split(/ +/);

        function sortByValueAndIndex(data) {
        
        }

        if (args[1]) {
            keyv.delete(message.author.id)
            keyv.set(message.author.id, args[1])
            let prevScore = keyv.get(message.author.id)
            if (prevScore) {
                message.channel.send("Jest")
            } else {
                message.channel.send("Nie ma")
            }
            message.channel.send(`${prevScore}`)
            message.channel.send(`<@${message.author.id}> pobił rekord z `);

        } else {

        }

    }
}
