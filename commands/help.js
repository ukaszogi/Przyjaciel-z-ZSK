module.exports = {
    name: "help",
    description: "Shows this message",
    aliases: ['pomoc', '?', 'commands'],
    execute(client, message, args) {
        const Discord = require('discord.js');
        const fs = require('fs')
        let listaKomend = ""
        fs.readdir("./commands", (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                let commandName = file.split(".")[0];
                let command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                if (args.length<1) {
                    listaKomend += command.name + ", "
                }
            });
            const exampleEmbed = {
                color: 0x28166f,
                title: 'Pomoc',
                author: {
                    name: 'Przyjaciel z ZSK',
                    icon_url: 'https://www.zsk.poznan.pl/wp-content/uploads/2019/05/cropped-m_logo-192x192.png',
                },
                description: 'Poniżej znajdują się przydatne linki oraz komendy do bota',
                fields: [
                    {
                        name: 'Zaproszenie',
                        value: 'Link do zaproszenia wkrótce się tutaj znajdzie ;)',
                    },
                    {
                        name: 'Lista dostępnych komend',
                        value: listaKomend.slice(0,-2) + "\nAby uzyskać więcej informacji o komendzie wpisz: `" + client.config.prefix + "help [komenda]`",
                        inline: false,
                    },
                    {
                        name: 'Pomoc',
                        value: 'Coś nie działa w bocie i nie wiesz jak sobie z tym poradzić? Dołącz do serwera poniżej aby skontaktować się z developerem bota',
                        inline: false,
                    },
                    {
                        name: 'Oficjalny serwer',
                        value: 'No tutaj ogólnie kiedyś będzie linczek do sewera',
                        inline: false,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Przyjaciel z ZSK',
                    icon_url: 'https://www.zsk.poznan.pl/wp-content/uploads/2019/05/cropped-m_logo-192x192.png',
                },
            };
            message.channel.send({embed: exampleEmbed});
        });
    }
}
