module.exports = {
    name: "wisielec",
    description: "Chcesz zagrać w wisielca? To komenda specjalnie dla ciebie",
    aliases: ['wis'],
    usage: 'wisielec start [hasło]\npo rozoczęciu gry: wi [literka]',
    category: 'fun',
    execute(client, message, args) {
        const wisielson = require("./../wisiel.json")
        let zgadywane = [];
        let haslo = "test";
        let haslokryte = [];
        let proby = 8;
        juzgramy = Boolean(false);

        if (args[0] === "start") {
            if (args[1] != null) {
                args.shift();
                haslo = args.join(" ").toLowerCase();
                for (x in haslo) {
                    if (haslo[x] === " ") haslokryte[x] = ` `; else haslokryte[x] = "-";
                }
                message.delete();
                var haslokrytestr = haslokryte.toString().replace(/,/g, "");
                message.channel.send("\`\`\`" + `-=-=-=-=-WISIELEC-=-=-=-=-\nGra się zaczęła. Można zgadywać literki pisząc np. wi A\n${haslokrytestr}` + "\`\`\`" + "\`\`\`" + wisielson.piec + "\`\`\`");
            } else message.channel.send("Aby rozpocząć wpisz hasło");

            const filter = m => m.content.startsWith('wi ');
            const collector = message.channel.createMessageCollector(filter, {time: 1000000});

            collector.on('collect', m => {
                var literka = m.content.replace("wi ", "").toLowerCase();
                if (m.content === "wi stop") {
                    collector.stop('koniec');
                    return;
                }
                if (literka === haslo) {
                    message.channel.send("zgadłeś!");
                    collector.stop('koniec');
                    return;
                } else if (literka.length !== 1) {
                    message.channel.send("nieprawidłowy format literki");
                    return;
                }
                zgadywane.push(literka.toUpperCase());
                var i = 0;
                for (l in haslo) {
                    if (haslo[l] === literka) haslokryte[l] = literka;
                    else i++;
                }
                if (i === haslo.length) proby -= 1;
                var haslokrytest = haslokryte.toString().replace(/,/g, "");
                message.channel.send("\`\`\`" + `Użyte literki: ${zgadywane}\nPozostało pomyłek: ${proby}\n${haslokrytest}` + "\`\`\`");

                if (proby === 0) message.channel.send("\`\`\`" + wisielson.zero + "\`\`\`");
                else if (proby === 1) message.channel.send("\`\`\`" + wisielson.jeden + "\`\`\`");
                else if (proby === 2) message.channel.send("\`\`\`" + wisielson.dwa + "\`\`\`");
                else if (proby === 3) message.channel.send("\`\`\`" + wisielson.trzy + "\`\`\`");
                else if (proby === 4) message.channel.send("\`\`\`" + wisielson.cztery + "\`\`\`");
                else if (proby === 5) message.channel.send("\`\`\`" + wisielson.piec + "\`\`\`");
                if (haslokrytest === haslo) {
                    message.channel.send("\`\`\`" + "odganięto hasło! Gratulacje!" + "\`\`\`")
                    collector.stop('koniec');
                }
                if (proby === 0) {
                    message.channel.send("\`\`\`" + `Przegrałeś! Hasło to \"${haslo}\"` + "\`\`\`");
                    collector.stop('koniec');
                }
            });

            collector.on('end', (collected, p) => {
                if (p !== 'koniec') message.channel.send(`Przekroczono limit czasu :(`);
                else message.channel.send("\`\`\`" + "KONIEC" + "\`\`\`")
            });
        }
    }
}
