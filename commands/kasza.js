exports.run = (client, message, args) => {
	const config = require("./../auth.json");
	if (message.author.id==config.ownerIDMat||message.author.id==config.ownerIDLuk){
		let membur = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		message.channel.send(membur+" ty cieniasie");
	}
	else message.reply(" jesteś cieniasem")
}
