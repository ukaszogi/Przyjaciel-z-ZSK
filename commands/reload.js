module.exports = {
    name: "reload",
    description: "",
    aliases: ['przeładuj', 'rld'],
    usage: 'reload [komenda]',
    execute(client, message, args) {
        let auth = require("../auth.json")
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
