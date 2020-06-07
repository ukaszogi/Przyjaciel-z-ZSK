module.exports = {
    name: "powiedz",
    description: "",
    aliases: ['tell', 'say'],
    usage: 'powiedz [coś co bot ma powtórzyć]',
    execute(client, message, args) {
        let text = args.join(" ");
        message.delete();
        message.channel.send(text);
    }
}
