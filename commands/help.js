exports.run = (client, message, args) => {
    const fs = require('fs')
    var tab = []
    fs.readdir("./commands", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let commandName = file.split(".")[0];
            tab.unshift(commandName);
        });
        message.author.send(tab);
        message.channel.send("wysłano wieadomość dm z listą komend");
    });
}
