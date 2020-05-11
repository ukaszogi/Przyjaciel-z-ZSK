exports.run = (client, message, args) => {
    const uuidv4 = require('uuidv4')
    const signer = require("@wulkanowy/uonet-request-signer");
    const request = require("request")
    const Discord = require('discord.js');
    const jdo = require("../wrazliweDane.json")
    let pozycja = null

    jdo.forEach(function (item, position) {
        if (item.dcId==message.author.id) pozycja = position
        console.log(pozycja)
    })

    if (pozycja == null) {
        message.channel.send("najpierw musisz się zalogować używając komendy: `$zsklogin [token] [symbol] [pin]`")
        return
    }

    const certificateKey1 = jdo[pozycja].certyfikatKlucz
    const password1 = require("../auth.json").password
    const certificate1 = jdo[pozycja].certyfikatPfx
    const urlPlan = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami';
    const timekey = Math.floor(Date.now() / 1000)
    const timekey1 = timekey - 1
    const idOddzial = jdo[pozycja].idOddzial
    const idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny
    const idUczen = jdo[pozycja].idUczen

    let formPlan = {
        "DataPoczatkowa": "2020-05-11",
        "DataKoncowa": "2020-05-17",
        "IdOddzial": idOddzial,
        "IdOkresKlasyfikacyjny": idOkresKlasyfikacyjny,
        "IdUczen": idUczen,
        "RemoteMobileTimeKey": timekey,
        "TimeKey": timekey1,
        "RequestId": uuidv4.uuid(),
        "RemoteMobileAppVersion": "19.4.1.436",
        "RemoteMobileAppName": "VULCAN-Android-ModulUcznia"
    }
    let formData = JSON.stringify(formPlan)

    signer.signContent(password1, certificate1, formData).then(signed => {
        console.log("\n\nsigned\n" + signed + "\n\n\n");
        message.channel.startTyping()
        request({
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'RequestCertificateKey': certificateKey1,
                'RequestSignatureValue': signed,
                'User-Agent': 'MobileUserAgent'
            },
            url: urlPlan,
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            var json = JSON.parse(body);
            console.log(body);
            lekcje = json.Data
            tabwynik = []
            var lekcja = "", co = "", gdzie = ""

            lekcje.forEach(function (item) {
                    if (item.DzienTekst === "2020-05-11" && item.PlanUcznia === true) {
                        tabwynik.push(item.NumerLekcji + "," + item.Sala + "," + item.PrzedmiotNazwa)
                    }
                }
            )
            tabwynik.sort()
            tabwynik.forEach(function (item) {
                cale = item.split(",")
                lekcja += cale[0] + "\n"
                gdzie += cale[1] + "\n"
                co += cale[2] + "\n"
            })
            let Embed = new Discord.RichEmbed()
                .setTitle("**PLAN LEKCJI**")
                .setColor("#58ff1d")
                .addField("Nr", lekcja, true)
                .addField("Sala", gdzie, true)
                .addField("Przedmiot", co, true)
            message.channel.send(Embed);
            message.channel.stopTyping()
        });
    });


}
