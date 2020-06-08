module.exports = {
    name: "powiedz",
    description: "Powtarza wszystko po 'powiedz '",
    aliases: ['tell', 'say'],
    usage: 'powiedz [coś co bot ma powtórzyć]',
    category: 'fun',
    execute(client, message, args) {
        let text = args.join(" ");
        message.delete();
        message.channel.send(text);
    }
}
