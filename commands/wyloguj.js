module.exports = {
    name: "wyloguj",
    description: "Wylogowywuje z systemu uonet",
    aliases: ['logout', 'unlogin', 'wylogowanie'],
    usage: 'wyloguj',
    category: 'vulcan',
    execute(client, message) {
        message.channel.send("Czy na pewno chcesz się wylogować?");
        message.react('👍').then(() => message.react('👎'));

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                    message.reply('Wylogowywanie...');
                    const Keyv = require("keyv");
                    const keyv = new Keyv(require("../config.json").pathToDatabase);
                    (async () => {
                        if (await keyv.delete(message.author.id))
                            message.channel.send("Pomyślnie wylogowano")
                        else message.channel.send("Nie jesteś zalogowany")
                    })()
                } else {
                    message.reply('Anulowano wylogowywanie. Jesteś zalogowany');
                }
            })
            .catch(collected => {
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            });
    }
}