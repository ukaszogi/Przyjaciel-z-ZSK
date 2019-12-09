exports.run = (client, message, args) => {
	let text = args.join(" ");
	msg.delete();
	msg.channel.send(text);
}
