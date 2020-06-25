module.exports = {
    name: "reload",
    description: "Przeładowuje komendę. (Tylko właściciel bota może użyć tej komendy)",
    aliases: ['przeładuj', 'rld'],
    usage: 'reload [komenda]',
    category: 'admin',
    execute(client, message, args) {
        let auth = {
            "Token": process.env.TOKEN,
            "prefix": process.env.PREFIX,
            "pathToDatabase": process.env.PATH_TO_DATABASE,
            "password": process.env.PASSWORD,
            "FirebaseTokenKey": process.env.FIRE_BASE_TOKEN_KEY,
            "ownerIDMat": process.env.OWNER_ID_MAT,
            "ownerIDLuk": process.env.OWNER_ID_LUK
        }

        if (!(message.author.id === auth.ownerIDMat || message.author.id === auth.ownerIDLuk)) {
            return;
        }

        if (!args || args.length < 1) return message.reply("Musisz podać komendę.");
        const commandName = args[0];
        if (!client.commands.has(commandName)) {
            return message.reply("Ta komenda nie istnieje");
        }
        delete require.cache[require.resolve(`./${commandName}.js`)];
        client.commands.delete(commandName);
        const props = require(`./${commandName}.js`);
        client.commands.set(commandName, props);
        message.reply(`Komenda ${commandName} została odświeżona`);
    }
};
