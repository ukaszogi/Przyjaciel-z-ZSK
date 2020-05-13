exports.run = (client, message, args) => {
    let text = args.join(" ");
    message.delete();
    message.channel.send(text);
}
