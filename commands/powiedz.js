module.exports = {
    name: "powiedz",
    description: "",
    aliases: ['tell', 'say'],
    execute(client, message, args) {
        let text = args.join(" ");
        message.delete();
        message.channel.send(text);
    }
}
