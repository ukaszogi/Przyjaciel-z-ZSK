exports.run = (client, message, args) => {
	if (!message.author.id=="340604514820161536"||!message.author.id=="493080797943955476") return;

	if(!args || args.length < 1) return message.reply("Musisz podać komendę.");
	const commandName = args[0];
	// Sprawdza czy istnieje
	if(!client.commands.has(commandName)) {
	return message.reply("Ta komenda nie istnieje");
	}
	delete require.cache[require.resolve(`./${commandName}.js`)];
	//trzeba usunąć i odświerzyć komendę z client.commands Enmap
	client.commands.delete(commandName);
	const props = require(`./${commandName}.js`);
	client.commands.set(commandName, props);
	message.reply(`Komenda ${commandName} została odświeżona`);
};
