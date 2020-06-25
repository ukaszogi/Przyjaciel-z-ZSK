module.exports = {
    name: "wyloguj",
    description: "Wylogowywuje z systemu uonet",
    aliases: ['logout', 'unlogin', 'wylogowanie'],
    usage: 'wyloguj',
    category: 'vulcan',
    execute(client, message) {
        const config = {
            "Token": process.env.TOKEN,
            "prefix": process.env.PREFIX,
            "pathToDatabase": process.env.PATH_TO_DATABASE,
            "password": process.env.PASSWORD,
            "FirebaseTokenKey": process.env.FIRE_BASE_TOKEN_KEY,
            "ownerIDMat": process.env.OWNER_ID_MAT,
            "ownerIDLuk": process.env.OWNER_ID_LUK
        }
        message.channel.send("Czy na pewno chcesz się wylogować? Jeżeli tak: zareaguj '👍', a jeżeli nie: zareaguj '👎' lub zignoruj wiadomość.");
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
                    const keyv = new Keyv(config.pathToDatabase);
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