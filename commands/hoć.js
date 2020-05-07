exports.run = (client, message, args) => {
	let channel = client.channels.get('469292008163508224');
	channel.join();
	message.channel.send("przybywam ;)");
}
