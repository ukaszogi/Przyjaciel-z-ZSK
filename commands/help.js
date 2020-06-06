module.exports = {
    name: "help",
    description: "Shows this message",
    aliases: ['pomoc', '?', 'commands'],
    execute(client, message, args) {
        const fs = require('fs')
        var tab = []
        fs.readdir("./commands", (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                let commandName = file.split(".")[0];
                let command = client.commands.get(commandName)
                tab.push(command.name + " - " + command.description);
            });
            message.channel.send(tab);
        });
    }
}
