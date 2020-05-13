exports.run = (client, message, args) => {
    auth = require("../auth.json")
    if (!message.author.id == auth.ownerIDMat || !message.author.id == auth.ownerIDLuk) return;

    if (!args || args.length < 1) return message.reply("Musisz podać komendę.");
    const commandName = args[0];
    // Sprawdza czy istnieje
    if (!client.commands.has(commandName)) {
        return message.reply("Ta komenda nie istnieje");
    }
    delete require.cache[require.resolve(`./${commandName}.js`)];
    //trzeba usunąć i odświeżyć komendę z client.commands Enmap
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`Komenda ${commandName} została odświeżona`);
};
